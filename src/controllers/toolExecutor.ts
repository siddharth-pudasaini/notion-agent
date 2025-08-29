/**
 * Notion API Tool Executor
 * This file contains functions that execute Notion API calls using the SDK
 * based on structured data from LLM tool calls.
 */

import { Client } from "@notionhq/client";
import type {
  CreatePageParameters,
  GetPageParameters,
  UpdatePageParameters,
  GetPagePropertyParameters,
  CreateDatabaseParameters,
  GetDatabaseParameters,
  UpdateDatabaseParameters,
  QueryDatabaseParameters,
  GetBlockParameters,
  UpdateBlockParameters,
  DeleteBlockParameters,
  ListBlockChildrenParameters,
  AppendBlockChildrenParameters,
  GetUserParameters,
  ListUsersParameters,
  GetSelfParameters,
  CreateCommentParameters,
  ListCommentsParameters,
  GetCommentParameters,
  SearchParameters,
  CreateFileUploadParameters,
  GetFileUploadParameters,
  ListFileUploadsParameters,
} from "@notionhq/client/build/src/api-endpoints";

// Generic response type for all tool functions
export interface ToolResponse {
  isError: boolean;
  response: any;
}

export interface ToolExecutorConfig {
  notionApiKey: string;
  notionVersion?: string;
}

export class NotionToolExecutor {
  private client: Client;

  constructor(config: ToolExecutorConfig) {
    this.client = new Client({
      auth: config.notionApiKey,
      notionVersion: config.notionVersion || "2022-06-28",
    });
  }

  // Page Methods
  private async createPage(
    params: CreatePageParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.pages.create(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to create page: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async getPage(params: GetPageParameters): Promise<ToolResponse> {
    try {
      const result = await this.client.pages.retrieve(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to get page: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async updatePage(
    params: UpdatePageParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.pages.update(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to update page: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async getPageProperty(
    params: GetPagePropertyParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.pages.properties.retrieve(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to get page property: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  // Database Methods
  private async createDatabase(
    params: CreateDatabaseParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.databases.create(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to create database: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async getDatabase(
    params: GetDatabaseParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.databases.retrieve(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to get database: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async updateDatabase(
    params: UpdateDatabaseParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.databases.update(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to update database: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async queryDatabase(
    params: QueryDatabaseParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.databases.query(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to query database: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  // Block Methods
  private async getBlock(params: GetBlockParameters): Promise<ToolResponse> {
    try {
      const result = await this.client.blocks.retrieve(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to get block: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async updateBlock(
    params: UpdateBlockParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.blocks.update(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to update block: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async deleteBlock(
    params: DeleteBlockParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.blocks.delete(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to delete block: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async listBlockChildren(
    params: ListBlockChildrenParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.blocks.children.list(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to list block children: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async appendBlockChildren(
    params: AppendBlockChildrenParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.blocks.children.append(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to append block children: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  // User Methods
  private async getUser(params: GetUserParameters): Promise<ToolResponse> {
    try {
      const result = await this.client.users.retrieve(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to get user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async listUsers(
    params: ListUsersParameters = {}
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.users.list(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to list users: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async getSelf(params: GetSelfParameters = {}): Promise<ToolResponse> {
    try {
      const result = await this.client.users.me(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to get self: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  // Comment Methods
  private async createComment(
    params: CreateCommentParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.comments.create(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to create comment: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async listComments(
    params: ListCommentsParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.comments.list(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to list comments: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async getComment(
    params: GetCommentParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.comments.retrieve(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to get comment: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  // Search Method
  private async search(params: SearchParameters = {}): Promise<ToolResponse> {
    try {
      const result = await this.client.search(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to search: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  // File Upload Methods
  private async createFileUpload(
    params: CreateFileUploadParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.fileUploads.create(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to create file upload: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async getFileUpload(
    params: GetFileUploadParameters
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.fileUploads.retrieve(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to get file upload: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private async listFileUploads(
    params: ListFileUploadsParameters = {}
  ): Promise<ToolResponse> {
    try {
      const result = await this.client.fileUploads.list(params);
      return {
        isError: false,
        response: result,
      };
    } catch (error) {
      return {
        isError: true,
        response: `Failed to list file uploads: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  //Utility method to execute any tool by name
  async executeTool(toolName: string, params: any): Promise<ToolResponse> {
    switch (toolName) {
      // Page tools
      case "create_page":
        return this.createPage(params);
      case "get_page":
        return this.getPage(params);
      case "update_page":
        return this.updatePage(params);
      case "get_page_property":
        return this.getPageProperty(params);

      // Database tools
      case "create_database":
        return this.createDatabase(params);
      case "get_database":
        return this.getDatabase(params);
      case "update_database":
        return this.updateDatabase(params);
      case "query_database":
        return this.queryDatabase(params);

      // Block tools
      case "get_block":
        return this.getBlock(params);
      case "update_block":
        return this.updateBlock(params);
      case "delete_block":
        return this.deleteBlock(params);
      case "list_block_children":
        return this.listBlockChildren(params);
      case "append_block_children":
        return this.appendBlockChildren(params);

      // User tools
      case "get_user":
        return this.getUser(params);
      case "list_users":
        return this.listUsers(params);
      case "get_self":
        return this.getSelf(params);

      // Comment tools
      case "create_comment":
        return this.createComment(params);
      case "list_comments":
        return this.listComments(params);
      case "get_comment":
        return this.getComment(params);

      // Search
      case "search":
        return this.search();

      // File uploads
      case "create_file_upload":
        return this.createFileUpload(params);
      case "get_file_upload":
        return this.getFileUpload(params);
      case "list_file_uploads":
        return this.listFileUploads(params);

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  // Helper method to validate parameters against tool schema
  validateParameters(toolName: string, params: any): boolean {
    // This could be enhanced with more sophisticated validation
    // For now, we'll rely on TypeScript and the Notion API to validate
    if (!params || typeof params !== "object") {
      return false;
    }

    // Basic validation for required parameters
    const requiredParams: Record<string, string[]> = {
      create_page: ["parent"],
      get_page: ["page_id"],
      update_page: ["page_id"],
      get_page_property: ["page_id", "property_id"],
      create_database: ["parent", "title", "properties"],
      get_database: ["database_id"],
      update_database: ["database_id"],
      query_database: ["database_id"],
      get_block: ["block_id"],
      update_block: ["block_id"],
      delete_block: ["block_id"],
      list_block_children: ["block_id"],
      append_block_children: ["block_id", "children"],
      get_user: ["user_id"],
      create_comment: ["parent", "rich_text"],
      list_comments: ["block_id"],
      get_comment: ["comment_id"],
      create_file_upload: ["file", "parent"],
      get_file_upload: ["file_upload_id"],
    };

    const required = requiredParams[toolName] || [];
    return required.every((param) => param in params);
  }

  // Helper methods for common operations

  /**
   * Create a simple text page
   */
  async createTextPage(
    parentPageId: string,
    title: string,
    content?: string
  ): Promise<ToolResponse> {
    const pageParams: CreatePageParameters = {
      parent: {
        page_id: parentPageId,
        type: "page_id",
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
    };

    if (content) {
      pageParams.children = [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: content,
                },
              },
            ],
          },
        },
      ];
    }

    return this.createPage(pageParams);
  }

  /**
   * Create a simple database with basic properties
   */
  async createSimpleDatabase(
    parentPageId: string,
    title: string,
    properties: Record<string, any>
  ): Promise<ToolResponse> {
    const dbParams: CreateDatabaseParameters = {
      parent: {
        page_id: parentPageId,
        type: "page_id",
      },
      title: [
        {
          text: {
            content: title,
          },
        },
      ],
      properties: properties,
    };

    return this.createDatabase(dbParams);
  }

  /**
   * Add a paragraph block to a page
   */
  async addParagraph(blockId: string, text: string): Promise<ToolResponse> {
    return this.appendBlockChildren({
      block_id: blockId,
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: text,
                },
              },
            ],
          },
        },
      ],
    });
  }

  /**
   * Add a heading block to a page
   */
  async addHeading(
    blockId: string,
    text: string,
    level: 1 | 2 | 3 = 1
  ): Promise<ToolResponse> {
    const richText = [
      {
        text: {
          content: text,
        },
      },
    ];

    let blockChild: any;

    switch (level) {
      case 1:
        blockChild = {
          object: "block",
          type: "heading_1",
          heading_1: {
            rich_text: richText,
          },
        };
        break;
      case 2:
        blockChild = {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: richText,
          },
        };
        break;
      case 3:
        blockChild = {
          object: "block",
          type: "heading_3",
          heading_3: {
            rich_text: richText,
          },
        };
        break;
      default:
        blockChild = {
          object: "block",
          type: "heading_1",
          heading_1: {
            rich_text: richText,
          },
        };
    }

    return this.appendBlockChildren({
      block_id: blockId,
      children: [blockChild],
    });
  }

  /**
   * Add a to-do item to a page
   */
  async addTodo(
    blockId: string,
    text: string,
    checked: boolean = false
  ): Promise<ToolResponse> {
    return this.appendBlockChildren({
      block_id: blockId,
      children: [
        {
          object: "block",
          type: "to_do",
          to_do: {
            rich_text: [
              {
                text: {
                  content: text,
                },
              },
            ],
            checked: checked,
          },
        },
      ],
    });
  }

  /**
   * Search for pages by title
   */
  async searchPages(query: string): Promise<ToolResponse> {
    return this.search({
      query: query,
      filter: {
        property: "object",
        value: "page",
      },
    });
  }

  /**
   * Search for databases by title
   */
  async searchDatabases(query: string): Promise<ToolResponse> {
    return this.search({
      query: query,
      filter: {
        property: "object",
        value: "database",
      },
    });
  }
}

// Export types for external use
export type {
  CreatePageParameters,
  GetPageParameters,
  UpdatePageParameters,
  GetPagePropertyParameters,
  CreateDatabaseParameters,
  GetDatabaseParameters,
  UpdateDatabaseParameters,
  QueryDatabaseParameters,
  GetBlockParameters,
  UpdateBlockParameters,
  DeleteBlockParameters,
  ListBlockChildrenParameters,
  AppendBlockChildrenParameters,
  GetUserParameters,
  ListUsersParameters,
  GetSelfParameters,
  CreateCommentParameters,
  ListCommentsParameters,
  GetCommentParameters,
  SearchParameters,
  CreateFileUploadParameters,
  GetFileUploadParameters,
  ListFileUploadsParameters,
};
