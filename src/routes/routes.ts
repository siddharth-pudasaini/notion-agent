import { Router } from "express";
import { AppError } from "../middlewares/errorHandler";
import { allTools } from "../schemas/toolSchema";
import { NotionToolExecutor } from "../controllers/toolExecutor";
import { OrchestratorService } from "../services/AgentOrchestrator";

const router = Router();

router.post("/api/chat", async (req, res) => {
  try {
    const { prompt, notionApiKey, rootPageId } = req.body;
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
    const orchestrator = new OrchestratorService(executor, newPrompt);
    const result = await orchestrator.run();
    res.json({
      success: true,
      response: result,
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
