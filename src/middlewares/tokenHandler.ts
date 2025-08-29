import type { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler";

// Extend the Request interface to include notionApiKey
declare global {
  namespace Express {
    interface Request {
      notionApiKey?: string;
    }
  }
}

/**
 * Get Notion API token from environment variable
 * This is the current implementation using env variable
 */
const getTokenFromEnv = (): string => {
  const token = process.env.NOTION_API_KEY;
  if (!token) {
    throw new AppError(
      "Notion API key not configured in environment variables",
      500
    );
  }
  return token;
};

/**
 * Future implementation: Get Notion API token from network call
 * This function will be implemented when network-based token retrieval is needed
 */
const getTokenFromNetwork = async (
  userIdentifier: string,
  workspaceId?: string
): Promise<string> => {
  // TODO: Implement network call to get token
  // Example implementation:
  //
  // const response = await fetch(`${TOKEN_SERVICE_URL}/tokens`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${SERVICE_AUTH_TOKEN}`
  //   },
  //   body: JSON.stringify({
  //     userId: userIdentifier,
  //     workspaceId: workspaceId,
  //     service: 'notion'
  //   })
  // });
  //
  // if (!response.ok) {
  //   throw new AppError('Failed to retrieve Notion API token', 401);
  // }
  //
  // const data = await response.json();
  // return data.accessToken;

  throw new AppError("Network-based token retrieval not yet implemented", 501);
};

/**
 * Middleware to attach Notion API key to request
 * For now, it uses the environment variable NOTION_API_KEY
 * Later, this can be modified to make network calls to get tokens
 */
const tokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let notionApiKey: string;

    // Check if we should use network-based token retrieval
    const useNetworkTokens = process.env.USE_NETWORK_TOKENS === "true";

    if (useNetworkTokens) {
      // Future implementation: Extract user identifier from request
      // This could come from JWT token, session, headers, etc.
      const userIdentifier = req.headers["x-user-id"] as string;
      const workspaceId = req.headers["x-workspace-id"] as string;

      if (!userIdentifier) {
        throw new AppError(
          "User identifier required for network token retrieval",
          400
        );
      }

      notionApiKey = await getTokenFromNetwork(userIdentifier, workspaceId);
    } else {
      // Current implementation: Use environment variable
      notionApiKey = getTokenFromEnv();
    }

    // Attach the API key to the request object
    req.notionApiKey = notionApiKey;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to process authentication token", 500);
  }
};

export default tokenHandler;
