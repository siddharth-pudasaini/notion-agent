import { NotionToolExecutor } from "../controllers/toolExecutor";
import type { ToolResponse } from "../controllers/toolExecutor";
import { allTools, getToolByName } from "../schemas/toolSchema";
import { LLMService } from "./LLMService";
import { AOSLogger } from "./AOSLogger";

/** Defines the available log events for the service */
export type event =
  | "thinking"
  | "searching"
  | "processing"
  | "memory"
  | "tool"
  | "deciding"
  | "error"
  | "success";

const logEmojis = {
  thinking: "💭",
  searching: "🔍",
  processing: "🔄",
  memory: "🧠",
  tool: "🔧",
  deciding: "🤔",
  error: "❌",
  success: "✅",
};

interface ToolCallResponse extends ToolResponse {
  stepId: string;
}

interface ToolCallRequest {
  name: string;
  args: any;
  guidline: string;
  id: string;
}

export interface OrchestratorState {
  actionPlan: ActionPlan;
  executionResults: Record<string, string[]>;
  currentStepErrors: ToolCallError[];
  callQueue: ToolCallRequest[];
  currentStep: string;
  completedStepResponses: ToolCallResponse[];
  toolExecuting: boolean;
}

/**
 * Represents the AI-generated action plan for executing a user's request
 * Contains the overall success status, failure reason if any, and the sequence of steps to execute
 */
interface ActionPlan {
  success: boolean;
  failedReason: string | null;
  steps: Step[] | null;
}

/**
 * Represents a single step in the action plan
 * Each step corresponds to a specific tool execution with its dependencies and purpose
 */
export interface Step {
  id: string;
  tool: string;
  purpose: string;
  input_suggestions: string;
  depends_on: string[];
  taskGroup: number;
}

/**
 * Represents an error that occurred during a tool execution
 * Contains both the error message and the data that caused the error
 */
export interface ToolCallError {
  error: string;
  dataProducingError: string;
}

/**
 * LLMService handles the orchestration of AI-driven operations for Airtable.
 * It uses OpenAI to:
 * 1. Generate action plans based on user prompts
 * 2. Execute Airtable operations in a sequential manner
 * 3. Handle retries and error recovery
 * 4. Maintain execution history and dependencies
 */
export class OrchestratorService {
  // private readonly model: string = "gpt-5-mini-2025-08-07";
  private readonly maxRetries: number = 3;
  private readonly llmService: LLMService;
  private notionController: NotionToolExecutor;
  private orchestratorState: OrchestratorState;
  private aosLogger: AOSLogger;

  constructor(
    notionController: NotionToolExecutor,
    userPrompt: string,
    aosLogger: AOSLogger
  ) {
    this.notionController = notionController;
    this.orchestratorState = {
      actionPlan: {
        success: false,
        failedReason: null,
        steps: null,
      },
      executionResults: {},
      currentStepErrors: [],
      callQueue: [],
      currentStep: "",
      completedStepResponses: [],
      toolExecuting: false,
    };
    this.llmService = new LLMService(userPrompt);
    this.aosLogger = aosLogger;
  }

  private async log(event: event, message: string) {
    console.log(`${logEmojis[event]}: ${message.trim().substring(0, 100)}`);
    await this.aosLogger.log(message.trim().substring(0, 100), event);
    return;
  }

  private async retryTool() {
    let retries = 0;
    let retryResult: ToolResponse | null = null;
    while (retries < this.maxRetries) {
      try {
        const currentStep = this.orchestratorState.actionPlan.steps?.find(
          (step) => step.id === this.orchestratorState.currentStep
        );
        if (!currentStep) {
          throw new Error(
            `Step ${this.orchestratorState.currentStep} not found`
          );
        }
        const toolSchema = getToolByName(currentStep.tool);
        if (!toolSchema) {
          throw new Error(`Tool ${currentStep.tool} not found`);
        }
        const regeneratedToolData = await this.llmService.regenerateDataForTool(
          this.orchestratorState
        );
        if (!regeneratedToolData) {
          throw new Error(
            `Failed to regenerate data for tool ${currentStep.tool}`
          );
        }
        retryResult = await this.notionController.executeTool(
          currentStep.tool,
          regeneratedToolData
        );
        if (retryResult.isError) {
          this.log("error", `Failed to retry tool: ${retryResult.response}`);
          this.orchestratorState.currentStepErrors.push({
            error: retryResult.response,
            dataProducingError: JSON.stringify(regeneratedToolData),
          });
          retryResult = null;
          retries++;
        } else {
          this.log(
            "success",
            `Tool ${currentStep.tool} succeeded with result: ${JSON.stringify(
              retryResult.response
            )}`
          );
          break;
        }
      } catch (error) {
        this.log("error", `Failed to retry tool: ${error}`);
        this.orchestratorState.currentStepErrors.push({
          error: "Failed to retry tool",
          dataProducingError: "No data was produced",
        });
        retries++;
      }
    }
    return retryResult;
  }

  private async modifyActionPlan() {
    this.log("thinking", "Modifying action plan");
    const newActionPlan = await this.llmService.modifyActionPlan(
      this.orchestratorState
    );
    this.orchestratorState.actionPlan = newActionPlan;
    this.log("success", "Action plan modified");

    const steps = newActionPlan.steps;
    console.log(steps);
    this.orchestratorState.callQueue = [];
    this.orchestratorState.executionResults = {};
    this.orchestratorState.currentStepErrors = [];
    this.orchestratorState.completedStepResponses = [];
    this.orchestratorState.currentStep = "";
    this.orchestratorState.toolExecuting = false;

    for (const step of steps) {
      const toolCallRequest: ToolCallRequest = {
        name: step.tool,
        args: {},
        guidline: step.input_suggestions,
        id: step.id,
      };
      this.orchestratorState.callQueue.push(toolCallRequest);
    }
  }

  /**
   * Executes the next tool in the queue
   * Handles tool data generation, execution, and error recovery
   * Updates execution history with results
   * @returns Tool execution result or void if queue is empty
   */
  private async executeTools() {
    try {
      //Set toolExecuting to true
      this.orchestratorState.currentStepErrors = [];
      this.orchestratorState.toolExecuting = true;

      //Get the next tool call request from the queue
      const request = this.orchestratorState.callQueue[0];
      if (!request) {
        //Set toolExecuting to false and return if there are no more tool call requests
        this.orchestratorState.toolExecuting = false;
        return;
      }
      this.orchestratorState.currentStep = request.id;
      //Get the tool schema for the tool
      const tool = getToolByName(request.name);
      if (!tool) {
        //Set toolExecuting to false and throw an error if the tool is not found
        this.orchestratorState.toolExecuting = false;
        throw new Error(`Tool ${request.name} not found`);
      }
      const currentStep = this.orchestratorState.actionPlan.steps?.find(
        (step) => step.id === request.id
      );
      if (!currentStep) {
        this.orchestratorState.toolExecuting = false;
        throw new Error(`Step ${request.id} not found`);
      }
      const toolData = await this.llmService.generateDataForTool(
        this.orchestratorState
      );
      if (!toolData) {
        this.orchestratorState.toolExecuting = false;
        throw new Error(`Failed to generate data for tool ${request.name}`);
      }
      request.args = toolData;
      this.log(
        "processing",
        `Calling tool ${request.name} with data: ${JSON.stringify(
          request.args
        )}`
      );
      let result: ToolResponse | null = await this.notionController.executeTool(
        request.name,
        request.args
      );

      if (result.isError) {
        this.log(
          "error",
          `Tool ${request.name} failed with error: ${result.response}`
        );
        this.orchestratorState.currentStepErrors.push({
          error: result.response,
          dataProducingError: JSON.stringify(toolData),
        });
        const retryResult = await this.retryTool();
        if (retryResult) {
          result = retryResult;
          this.log(
            "success",
            `Tool ${request.name} succeeded with result: ${JSON.stringify(
              result.response
            )}`
          );
        } else {
          this.log("error", `All retries failed for tool ${request.name} `);
          result = null;
        }
      } else {
        this.log(
          "success",
          `Tool ${request.name} succeeded with result: ${JSON.stringify(
            result.response
          )}`
        );
      }
      let stepHistory = this.orchestratorState.executionResults[request.id!];
      if (!stepHistory) {
        stepHistory = [];
      }
      stepHistory.push(
        `Result of step ${request.id}: ${JSON.stringify(
          result?.response || "No result"
        )}`
      );
      this.orchestratorState.executionResults[request.id!] = stepHistory;
      this.orchestratorState.toolExecuting = false;
      this.orchestratorState.callQueue.shift();
      return result;
    } catch (error) {
      this.log("error", `Failed to execute tool: ${error}`);
      this.orchestratorState.toolExecuting = false;
      throw error;
    }
  }

  /**
   * Main execution method that orchestrates the entire process
   * 1. Generates an action plan
   * 2. Creates tool call requests
   * 3. Executes tools in sequence
   * 4. Generates a summary of the execution
   * @returns A markdown-formatted summary of the execution
   */
  async run() {
    this.log("thinking", "Generating action plan");

    //Generate Action Plan for the user prompt
    const actionPlan = await this.llmService.makeActionPlan();
    this.orchestratorState.actionPlan = actionPlan;
    this.log("memory", "Action plan generated");

    //Check if the action plan is valid
    if (!actionPlan) {
      throw new Error("Failed to generate action plan");
    }
    console.log(actionPlan);

    //Create tool call requests for each step in the action plan
    const steps = actionPlan.steps;
    for (const step of steps) {
      const toolCallRequest: ToolCallRequest = {
        name: step.tool,
        args: {},
        guidline: step.input_suggestions,
        id: step.id,
      };
      this.orchestratorState.callQueue.push(toolCallRequest);
      this.orchestratorState.executionResults[step.id!] = [];
    }

    //Execute tools in sequence
    do {
      if (
        this.orchestratorState.callQueue.length > 0 &&
        !this.orchestratorState.toolExecuting
      ) {
        const result = await this.executeTools();
        if (!result) {
          await this.modifyActionPlan();
        }
      }
    } while (
      this.orchestratorState.callQueue.length > 0 &&
      !this.orchestratorState.toolExecuting
    );

    //Generate summary of the execution
    this.orchestratorState.toolExecuting = false;
    const summary = await this.llmService.generateSummary(
      this.orchestratorState
    );
    this.log("success", "Execution completed");

    return summary;
  }
}

export default LLMService;
