import { Router } from "express";
import { AppError } from "../middlewares/errorHandler";
import { allTools } from "../schemas/toolSchema";
import { NotionToolExecutor } from "../controllers/toolExecutor";
import { OrchestratorService, type FileAttachment } from "../services/AgentOrchestrator";
import { AOSLogger } from "../services/AOSLogger";


const router = Router();

router.post("/api/chat", async (req, res) => {
  const startTimestamp = new Date();
  try {
    let { prompt, fileAttachments } = req.body;
    if (fileAttachments && fileAttachments.length > 0) {
      prompt += `\n\nFile attachments: ${JSON.stringify(fileAttachments)}`;
    }
    console.log(prompt);
    const sessionToken = req.headers["x-session-token"] as string;
    const aosApiKey = process.env.AOS_API_KEY || "";
    const aosBaseUrl = process.env.AOS_BASE_URL || "";
    const aosLogger = new AOSLogger(aosApiKey, aosBaseUrl, sessionToken);
    const notionApiKey = process.env.NOTION_API_KEY;
    const rootPageId = process.env.ROOT_PAGE_ID;
    if (!rootPageId) {
      throw new AppError("Root page ID not found in request", 400);
    }
    if (!notionApiKey) {
      throw new AppError("Notion API key not found in request", 400);
    }
    if (!prompt) {
      throw new AppError("Prompt not found in request", 400);
    }
    const executor = new NotionToolExecutor({
      notionApiKey,
    });
    const newPrompt = `${prompt}. The root ID is ${rootPageId}`;
    const orchestrator = new OrchestratorService(
      executor,
      newPrompt,
      aosLogger,
      fileAttachments as FileAttachment[]
    );
    const result = await orchestrator.run();
    const resultUI = {
      id: "result-card",
      type: "markdown",
      props: { className: "arkios-markdown-content", content: result },
    };
    res.status(200).json({
      status: "success",
      snippet: "I've created an AI-powered dashboard for you.",
      message: "Request processed successfully",
      conversation_id: "conv_123456",
      message_id: "msg_789012",
      created_at: startTimestamp.toISOString(),
      timeMs: new Date().getTime() - startTimestamp.getTime(),
      acknowledged: false,
      agent_id: "8bd9f9cb-7c0a-4e42-8be8-80397b10939c",
      suggestions: null,
      uiTree: resultUI,
    });
  } catch (error) {
    throw new AppError(
      `Agent failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      500
    );
  }
});

export default router;
