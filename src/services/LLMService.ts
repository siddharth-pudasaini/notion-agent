import { OpenAI } from "openai";
import {
  allTools,
  getToolByName,
  type ToolSchema,
} from "../schemas/toolSchema";
import type { OrchestratorState } from "./AgentOrchestrator";

export class LLMService {
  private readonly model: string = "gpt-4.1-2025-04-14";
  //   private readonly model: string = "gpt-5-mini-2025-08-07";
  private readonly openai: OpenAI;
  private userPrompt: string;
  private availableTools: ToolSchema[] = allTools;

  constructor(userPrompt: string) {
    this.userPrompt = userPrompt;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generates an action plan using OpenAI based on the user's prompt
   * The plan includes a sequence of steps needed to fulfill the user's request
   * @returns ActionPlan object or null if generation fails
   */
  public async makeActionPlan() {
    try {
      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          {
            role: "system",
            content: `
                You will be provided wil a list of tools and their descriptions.\n
                Your job is to make a action plan by chaining multiple tools to complete user's task.\n
                If user asks for something that cannot be performed with the help of given tools then the success should be set to false and everthing else must be null\n
                Your job is to generate action plan and you SHOULD NOT try to generate complete arguments for each tool.\n
                You should provide some useful suggestion for data generation for that tool which will happen in the next step.\n
                Some tools might need data from other tools, so you need to put tool calls in sequential order in the array.\n
                LIST ALL DEPENPENT STEPS IN THE DEPENDS_ON ARRAY.\n
                IF USER ASKS TO SEARCH FOR SOMETHING, PRIOTIZE USING BROADER SEARCH TOOLS LIKE SEARCH PAGES, SEARCH DATABASES, SEARCH BLOCKS.
                If baseid and tableid are missing in the user prompt, you must add tools to find those in the action plan.\n
                EXAMPLE: IF s3 depends on s2 and s2 depends on s1 then s3 should depend on both s1 and s2.\n
                Here are the tools and their descriptions:
                DONOT PUT TOOLS THAT ARE NOT AVAILABLE IN THE AVAILABLE TOOLS OBJECT.
                If users asks for something specific to them, then you must add tools to find who is that person.
                ==============================
                THE AVAILABLE TOOLS OBJECT IS:
                ${JSON.stringify(this.availableTools)}
                DONOT ADD TOOLS THAT ARE NOT AVAILABLE IN THE AVAILABLE TOOLS OBJECT.
                ==============================
                You will always have access to the root page id.
                The user might want to search other pages, so you must add tools to search for those pages in the action plan.
                IF user asks for the file upload, you must first create the file upload and after getting the status, attach the uploaded file id to blocks/pages/databases depends on the user prompt.
                You must always check the status of file upload after creating it before attaching the uploaded file id to blocks/pages/databases.
                Use presigned url to upload the file to the file upload session. donot modify the url before uploading the file.
                Use the presigned url as is to upload the file.
                If file upload fails then just attach the external url to the blocks/pages/databases. And mention to user that file upload failed.But the link is provided.
                ALWAYS CREATE PAGE AND DATABASES IN MULTIPLE STEPS IN CHUNKS. CREATE A PAGE OR DATABASE THEN ONLY ADD BLOCKS TO THAT PAGE OR DATABASE. DONT CREATE A PAGE OR DATABASE WITH NO BLOCKS.
                `,
          },
          {
            role: "user",
            content: this.userPrompt,
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "actionPlan",
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  description:
                    "False if the task cannot be done with given tools",
                },
                failedReason: {
                  type: ["string", "null"],
                  description: "If success=false, provide a reason; else null",
                },
                steps: {
                  type: ["array", "null"],
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", description: "Short id like s1" },
                      tool: {
                        type: "string",
                        description: "Tool name or identifier",
                      },
                      purpose: {
                        type: "string",
                        description: "What this step accomplishes",
                      },
                      input_suggestions: {
                        type: "string",
                        description:
                          "Suggestion for data generation for this tool call",
                      },
                      depends_on: {
                        type: "array",
                        items: { type: "string" },
                        description: "IDs of prior steps",
                      },
                      taskGroup: {
                        type: "number",
                        description:
                          "Should start with zero. If some tools can be called in parallel, then they should have same taskGroup",
                      },
                    },
                    required: [
                      "id",
                      "tool",
                      "purpose",
                      "input_suggestions",
                      "depends_on",
                      "taskGroup",
                    ],
                    additionalProperties: false,
                  },
                },
              },
              required: ["success", "failedReason", "steps"],
              additionalProperties: false,
            },
            strict: true,
          },
        },
      });
      const actionPlan = JSON.parse(response.output_text);
      return actionPlan;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private generateDependencyForTool(orchestratorState: OrchestratorState) {
    const step = orchestratorState.actionPlan.steps?.find(
      (step) => step.id === orchestratorState.currentStep
    );
    if (!step) {
      return [];
    }
    const dependencyHistory: string[] = [];
    for (const dependency of step.depends_on) {
      if (orchestratorState.executionResults[dependency]) {
        dependencyHistory.push(
          orchestratorState.executionResults[dependency].join("\n")
        );
      }
    }
    return dependencyHistory.join("\n\n");
  }

  /**
   * Generates input data for a specific tool using OpenAI
   * Takes into account the tool's requirements, input suggestions, and execution history
   * @param tool - The name of the tool to generate data for
   * @param input_suggestions - Suggestions for data generation
   * @param actionId - The ID of the current action step
   * @returns Generated data object or null if generation fails
   */
  public async generateDataForTool(orchestratorState: OrchestratorState) {
    try {
      const currentStep = orchestratorState.actionPlan.steps?.find(
        (step) => step.id === orchestratorState.currentStep
      );
      if (!currentStep) {
        throw new Error(`Step ${orchestratorState.currentStep} not found`);
      }
      const dependencyHistory =
        this.generateDependencyForTool(orchestratorState);
      const toolSchema = getToolByName(currentStep.tool);
      if (!toolSchema || toolSchema === undefined) {
        throw new Error(`Tool ${currentStep.tool} not found`);
      }
      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          {
            role: "system",
            content: `
                You are an expert in the field of Notion and you are a helpful assistant that generates data for a tool.\n
                You are a helpful assistant that generates data for a tool.\n
                You will be provided with a tool name and a list of input suggestions, execution history and action plan.\n
                You need to generate data for the tool.\n
                You need to generate data for the tool as per the schema.\n
                You must look at the execution history to get the data from previous tools.\n
                You must look at the input suggestions to get the information on what data to generate.\n
                You will also be provided with the action plan.\n  
                You should look at the action plan and the execution history to generate the data for the tool.\n
                YOU MUST ONLY GENERATE DATA FOR THE TOOL AND NOTHING ELSE.
                THE OUTPUT MUST BE IN JSON FORMAT.
                `,
          },
          {
            role: "user",
            content: this.userPrompt,
          },
          {
            role: "assistant",
            content: ` The action plan is ${JSON.stringify(
              orchestratorState.actionPlan
            )}\n
                The execution history is ${dependencyHistory}\n
                The input suggestions are ${currentStep.input_suggestions}\n
                The current step is ${currentStep.id}\n
                Only generate data for this tool and this step.`,
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "toolCall",
            schema: toolSchema.parameters,
            strict: false,
          },
        },
      });
      const data = JSON.parse(response.output_text);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Retries a failed tool execution with corrected input data
   * Uses OpenAI to analyze the error and generate new input data
   * @param request - The original tool call request
   * @param error - The error message from the failed attempt
   * @param data - The data that caused the error
   * @returns Tool execution result or null if all retries fail
   */
  async regenerateDataForTool(orchestratorState: OrchestratorState) {
    const currentStep = orchestratorState.actionPlan.steps?.find(
      (step) => step.id === orchestratorState.currentStep
    );
    if (!currentStep) {
      throw new Error(`Step ${orchestratorState.currentStep} not found`);
    }
    const dependencyHistory = this.generateDependencyForTool(orchestratorState);
    const toolSchema = getToolByName(currentStep.tool);
    if (!toolSchema || toolSchema === undefined) {
      throw new Error(`Tool ${currentStep.tool} not found`);
    }
    const response = await this.openai.responses.create({
      model: this.model,
      input: [
        {
          role: "system",
          content: `
            You will be provided with the error messages that happened in the previous tool call.
            You will also be provided with the data that was generated in the previous tool call.
            You need to generate the data for the tool again.
            You need to generate the data for the tool in the format of the schema.
            You need to generate the data for the tool in the format of the schema.
            Please look at the error message, previous data and the dependency list to accurately populate the data in the given schema.
            Also look at the action plan to understand the dependencies between the tools.
            All error messages are for this current tool call.
            The action plan is:
            ${JSON.stringify(orchestratorState.actionPlan)}

            The error messages are:
            ${orchestratorState.currentStepErrors
              .map((error) => error.error)
              .join("\n")}

            The data that was generated in the previous tool call is:
            ${orchestratorState.currentStepErrors
              .map((error) => error.dataProducingError)
              .join("\n")}


            Data from previous tool calls is:
            ${dependencyHistory}

            The input suggestions are:
            ${currentStep.input_suggestions}

            The current step is:
            ${currentStep.id}

            The tool name is:
            ${currentStep.tool}
            
            `,
        },
      ],
    });
    return JSON.parse(response.output_text);
  }

  /**
   * Generates a user-friendly summary of the execution
   * Uses OpenAI to create a markdown-formatted summary that abstracts away technical details
   * @returns A markdown-formatted summary string
   */
  public async generateSummary(orchestratorState: OrchestratorState) {
    const response = await this.openai.responses.create({
      model: this.model,
      input: [
        {
          role: "system",
          content: `
            You are a helpful assistant that generates will provide the user with the output based on the execution history.
            The execution history is ${Object.values(
              orchestratorState.executionResults
            )
              .flat()
              .join("\n")}
            The user prompt is ${this.userPrompt}
            The action plan is ${JSON.stringify(orchestratorState.actionPlan)}
            Format in a way that is easy to understand for the user.
            Write it in a markdown format.
            DONOT MENTION ANY FURTHER POSSIBLE ACTIONS.
            Abstract away the internal details of the execution history.
            Do not mention the tool names in the summary.
            Do not mention the tool arguments in the summary.
            Do not mention the tool results in the summary.
            Do not mention the tool errors in the summary.
            Do not mention the tool warnings in the summary.
            Do not mention the tool logs in the summary.
            Do not mention the tool metadata in the summary.
            `,
        },
      ],
    });
    const summary = response.output_text;
    return summary;
  }

  public async modifyActionPlan(orchestratorState: OrchestratorState) {
    try {
      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          {
            role: "system",
            content: `
                You will be provided wil a list of tools and their descriptions.\n
                Your job is to make a new action plan by chaining multiple tools to complete user's task.\n
                You will be provided with the old action plan and old execution history.\n
                You need to make a new action plan that is more efficient and more likely to succeed.\n
                If user asks for the file upload, you must first create the file upload and attach the uploaded file id to blocks/pages/databases depends on the user prompt.
  
                DONOT PUT TOOLS THAT ARE NOT AVAILABLE IN THE AVAILABLE TOOLS OBJECT.
                ==============================
                THE AVAILABLE TOOLS OBJECT IS:
                ${JSON.stringify(this.availableTools)}
                DONOT ADD TOOLS THAT ARE NOT AVAILABLE IN THE AVAILABLE TOOLS OBJECT.
                ==============================

                The old action plan is:
                ${JSON.stringify(orchestratorState.actionPlan)}
                The old execution history is:
                ${Object.values(orchestratorState.executionResults)
                  .flat()
                  .join("\n")}
                The current step is:
                ${orchestratorState.currentStep}
                The current step errors are:
                ${JSON.stringify(orchestratorState.currentStepErrors)}
                The completed step responses are:
                ${JSON.stringify(orchestratorState.completedStepResponses)}
                The action plan failed at step ${orchestratorState.currentStep}
                You will always have access to the root page id.
                The user might want to search other pages, so you must add tools to search for those pages in the action plan.
                ONLY MODIFY THE ACTION PLAN, IF CURRENT ERRORRS ARE NOT EMPTY OR IF THERES IS AN EFFECIENT WAY TO FINISH THE TASK.
                IF ACTION PLAN DOES NOT NEED TO BE MODIFIED RETURN THE ACTION PLAN WITH REMAINING STEPS.
  
                `,
          },
          {
            role: "user",
            content: this.userPrompt,
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "actionPlan",
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  description:
                    "False if the task cannot be done with given tools",
                },
                failedReason: {
                  type: ["string", "null"],
                  description: "If success=false, provide a reason; else null",
                },
                steps: {
                  type: ["array", "null"],
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", description: "Short id like s1" },
                      tool: {
                        type: "string",
                        description: "Tool name or identifier",
                      },
                      purpose: {
                        type: "string",
                        description: "What this step accomplishes",
                      },
                      input_suggestions: {
                        type: "string",
                        description:
                          "Suggestion for data generation for this tool call",
                      },
                      depends_on: {
                        type: "array",
                        items: { type: "string" },
                        description: "IDs of prior steps",
                      },
                      taskGroup: {
                        type: "number",
                        description:
                          "Should start with zero. If some tools can be called in parallel, then they should have same taskGroup",
                      },
                    },
                    required: [
                      "id",
                      "tool",
                      "purpose",
                      "input_suggestions",
                      "depends_on",
                      "taskGroup",
                    ],
                    additionalProperties: false,
                  },
                },
              },
              required: ["success", "failedReason", "steps"],
              additionalProperties: false,
            },
            strict: true,
          },
        },
      });
      const actionPlan = JSON.parse(response.output_text);
      return actionPlan;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default LLMService;
