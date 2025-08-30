/**
 * Notion API Tool Schemas for LLM Tool Calls
 * This file contains complete function schemas that an LLM can use to make tool calls
 * with appropriate arguments for the Notion API.
 */

export interface ToolSchema {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, any>;
    required: string[];
    additionalProperties: boolean;
  };
}

// Pages Tools
export const createPageTool: ToolSchema = {
  name: "create_page",
  description:
    "Create a new page in Notion. Can be created as a child of another page or database.",
  parameters: {
    type: "object",
    properties: {
      parent: {
        type: "object",
        description: "Parent page or database where this page will be created",
        oneOf: [
          {
            type: "object",
            properties: {
              page_id: { type: "string", description: "ID of the parent page" },
              type: { type: "string", enum: ["page_id"], default: "page_id" },
            },
            required: ["page_id"],
          },
          {
            type: "object",
            properties: {
              database_id: {
                type: "string",
                description: "ID of the parent database",
              },
              type: {
                type: "string",
                enum: ["database_id"],
                default: "database_id",
              },
            },
            required: ["database_id"],
          },
        ],
      },
      properties: {
        type: "object",
        description: "Page properties (varies based on parent type)",
        additionalProperties: true,
      },
      content: {
        type: "array",
        description: "Array of block objects to be appended as content",
        items: { type: "object" },
      },
      children: {
        type: "array",
        description: "Array of child block objects",
        items: { type: "object" },
      },
      icon: {
        type: "object",
        description: "Page icon (emoji or file)",
        properties: {
          type: { type: "string", enum: ["emoji", "external", "file"] },
          emoji: { type: "string" },
          external: { type: "object", properties: { url: { type: "string" } } },
          file: { type: "object", properties: { url: { type: "string" } } },
        },
      },
      cover: {
        type: "object",
        description: "Page cover image",
        properties: {
          type: { type: "string", enum: ["external", "file"] },
          external: { type: "object", properties: { url: { type: "string" } } },
          file: { type: "object", properties: { url: { type: "string" } } },
        },
      },
    },
    required: ["parent"],
    additionalProperties: false,
  },
};

export const getPageTool: ToolSchema = {
  name: "get_page",
  description: "Retrieve a page by its ID",
  parameters: {
    type: "object",
    properties: {
      page_id: {
        type: "string",
        description: "ID of the page to retrieve",
      },
      filter_properties: {
        type: "array",
        description: "Array of property names to filter the response",
        items: { type: "string" },
      },
    },
    required: ["page_id"],
    additionalProperties: false,
  },
};

export const updatePageTool: ToolSchema = {
  name: "update_page",
  description: "Update page properties, icon, cover, or archive status",
  parameters: {
    type: "object",
    properties: {
      page_id: {
        type: "string",
        description: "ID of the page to update",
      },
      properties: {
        type: "object",
        description: "Properties to update on the page",
        additionalProperties: true,
      },
      icon: {
        type: "object",
        description: "New page icon",
        nullable: true,
      },
      cover: {
        type: "object",
        description: "New page cover",
        nullable: true,
      },
      archived: {
        type: "boolean",
        description: "Whether the page is archived",
      },
      in_trash: {
        type: "boolean",
        description: "Whether the page is in trash",
      },
    },
    required: ["page_id"],
    additionalProperties: false,
  },
};

export const getPagePropertyTool: ToolSchema = {
  name: "get_page_property",
  description: "Retrieve a specific property from a page",
  parameters: {
    type: "object",
    properties: {
      page_id: {
        type: "string",
        description: "ID of the page",
      },
      property_id: {
        type: "string",
        description: "ID or name of the property to retrieve",
      },
      start_cursor: {
        type: "string",
        description: "Cursor for pagination",
      },
      page_size: {
        type: "number",
        description: "Number of items to return",
        minimum: 1,
        maximum: 100,
      },
    },
    required: ["page_id", "property_id"],
    additionalProperties: false,
  },
};

// Database Tools
export const createDatabaseTool: ToolSchema = {
  name: "create_database",
  description: "Create a new database in Notion",
  parameters: {
    type: "object",
    properties: {
      parent: {
        type: "object",
        description: "Parent page where database will be created",
        oneOf: [
          {
            type: "object",
            properties: {
              page_id: { type: "string", description: "ID of the parent page" },
              type: { type: "string", enum: ["page_id"], default: "page_id" },
            },
            required: ["page_id"],
          },
          {
            type: "object",
            properties: {
              database_id: {
                type: "string",
                description: "ID of the parent database",
              },
              type: {
                type: "string",
                enum: ["database_id"],
                default: "database_id",
              },
            },
            required: ["database_id"],
          },
        ],
      },
      title: {
        type: "array",
        description: "Title of the database as rich text",
        items: { type: "object" },
      },
      properties: {
        type: "object",
        description: "Database schema - defines columns and their types",
        additionalProperties: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: [
                "title",
                "rich_text",
                "number",
                "select",
                "multi_select",
                "date",
                "people",
                "files",
                "checkbox",
                "url",
                "email",
                "phone_number",
                "formula",
                "relation",
                "rollup",
                "created_time",
                "created_by",
                "last_edited_time",
                "last_edited_by",
                "status",
              ],
            },
          },
        },
      },
      icon: {
        type: "object",
        description: "Database icon",
        nullable: true,
      },
      cover: {
        type: "object",
        description: "Database cover image",
        nullable: true,
      },
      description: {
        type: "array",
        description: "Database description as rich text",
        items: { type: "object" },
      },
    },
    required: ["parent", "title", "properties"],
    additionalProperties: false,
  },
};

export const getDatabaseTool: ToolSchema = {
  name: "get_database",
  description: "Retrieve a database by its ID",
  parameters: {
    type: "object",
    properties: {
      database_id: {
        type: "string",
        description: "ID of the database to retrieve",
      },
    },
    required: ["database_id"],
    additionalProperties: false,
  },
};

export const updateDatabaseTool: ToolSchema = {
  name: "update_database",
  description: "Update database properties, title, description, icon, or cover",
  parameters: {
    type: "object",
    properties: {
      database_id: {
        type: "string",
        description: "ID of the database to update",
      },
      title: {
        type: "array",
        description: "New title as rich text",
        items: { type: "object" },
      },
      description: {
        type: "array",
        description: "New description as rich text",
        items: { type: "object" },
      },
      properties: {
        type: "object",
        description: "Properties to update in the database schema",
        additionalProperties: true,
      },
      icon: {
        type: "object",
        description: "New database icon",
        nullable: true,
      },
      cover: {
        type: "object",
        description: "New database cover",
        nullable: true,
      },
    },
    required: ["database_id"],
    additionalProperties: false,
  },
};

export const queryDatabaseTool: ToolSchema = {
  name: "query_database",
  description: "Query a database to retrieve pages that match certain criteria",
  parameters: {
    type: "object",
    properties: {
      database_id: {
        type: "string",
        description: "ID of the database to query",
      },
      filter: {
        type: "object",
        description: "Filter conditions to apply to the query",
        properties: {
          and: {
            type: "array",
            description: "All conditions must be true",
            items: { type: "object" },
          },
          or: {
            type: "array",
            description: "At least one condition must be true",
            items: { type: "object" },
          },
          property: { type: "string" },
          title: { type: "object" },
          rich_text: { type: "object" },
          number: { type: "object" },
          checkbox: { type: "object" },
          select: { type: "object" },
          multi_select: { type: "object" },
          date: { type: "object" },
          people: { type: "object" },
          files: { type: "object" },
          relation: { type: "object" },
          formula: { type: "object" },
        },
      },
      sorts: {
        type: "array",
        description: "Sort criteria for the results",
        items: {
          type: "object",
          properties: {
            property: {
              type: "string",
              description: "Property name to sort by",
            },
            timestamp: {
              type: "string",
              enum: ["created_time", "last_edited_time"],
            },
            direction: { type: "string", enum: ["ascending", "descending"] },
          },
        },
      },
      start_cursor: {
        type: "string",
        description: "Cursor for pagination",
      },
      page_size: {
        type: "number",
        description: "Number of results to return",
        minimum: 1,
        maximum: 100,
      },
      archived: {
        type: "boolean",
        description: "Whether to include archived pages",
      },
      in_trash: {
        type: "boolean",
        description: "Whether to include pages in trash",
      },
    },
    required: ["database_id"],
    additionalProperties: false,
  },
};

// Block Tools
export const getBlockTool: ToolSchema = {
  name: "get_block",
  description: "Retrieve a block by its ID",
  parameters: {
    type: "object",
    properties: {
      block_id: {
        type: "string",
        description: "ID of the block to retrieve",
      },
    },
    required: ["block_id"],
    additionalProperties: false,
  },
};

export const updateBlockTool: ToolSchema = {
  name: "update_block",
  description: "Update the content of a block",
  parameters: {
    type: "object",
    properties: {
      block_id: {
        type: "string",
        description: "ID of the block to update",
      },
      paragraph: {
        type: "object",
        description: "Paragraph block content",
        properties: {
          rich_text: {
            type: "array",
            items: { type: "object" },
          },
          color: { type: "string" },
        },
      },
      heading_1: {
        type: "object",
        description: "Heading 1 block content",
        properties: {
          rich_text: { type: "array", items: { type: "object" } },
          color: { type: "string" },
          is_toggleable: { type: "boolean" },
        },
      },
      heading_2: {
        type: "object",
        description: "Heading 2 block content",
        properties: {
          rich_text: { type: "array", items: { type: "object" } },
          color: { type: "string" },
          is_toggleable: { type: "boolean" },
        },
      },
      heading_3: {
        type: "object",
        description: "Heading 3 block content",
        properties: {
          rich_text: { type: "array", items: { type: "object" } },
          color: { type: "string" },
          is_toggleable: { type: "boolean" },
        },
      },
      bulleted_list_item: {
        type: "object",
        description: "Bulleted list item content",
        properties: {
          rich_text: { type: "array", items: { type: "object" } },
          color: { type: "string" },
        },
      },
      numbered_list_item: {
        type: "object",
        description: "Numbered list item content",
        properties: {
          rich_text: { type: "array", items: { type: "object" } },
          color: { type: "string" },
        },
      },
      to_do: {
        type: "object",
        description: "To-do block content",
        properties: {
          rich_text: { type: "array", items: { type: "object" } },
          checked: { type: "boolean" },
          color: { type: "string" },
        },
      },
      toggle: {
        type: "object",
        description: "Toggle block content",
        properties: {
          rich_text: { type: "array", items: { type: "object" } },
          color: { type: "string" },
        },
      },
      code: {
        type: "object",
        description: "Code block content",
        properties: {
          rich_text: { type: "array", items: { type: "object" } },
          language: { type: "string" },
          caption: { type: "array", items: { type: "object" } },
        },
      },
      archived: {
        type: "boolean",
        description: "Whether the block is archived",
      },
      in_trash: {
        type: "boolean",
        description: "Whether the block is in trash",
      },
    },
    required: ["block_id"],
    additionalProperties: false,
  },
};

export const deleteBlockTool: ToolSchema = {
  name: "delete_block",
  description: "Delete a block",
  parameters: {
    type: "object",
    properties: {
      block_id: {
        type: "string",
        description: "ID of the block to delete",
      },
    },
    required: ["block_id"],
    additionalProperties: false,
  },
};

export const listBlockChildrenTool: ToolSchema = {
  name: "list_block_children",
  description: "Retrieve children of a block (e.g., content of a page)",
  parameters: {
    type: "object",
    properties: {
      block_id: {
        type: "string",
        description: "ID of the parent block",
      },
      start_cursor: {
        type: "string",
        description: "Cursor for pagination",
      },
      page_size: {
        type: "number",
        description: "Number of results to return",
        minimum: 1,
        maximum: 100,
      },
    },
    required: ["block_id"],
    additionalProperties: false,
  },
};

export const appendBlockChildrenTool: ToolSchema = {
  name: "append_block_children",
  description: "Append new blocks as children to a parent block",
  parameters: {
    type: "object",
    properties: {
      block_id: {
        type: "string",
        description: "ID of the parent block",
      },
      children: {
        type: "array",
        description: "Array of block objects to append",
        items: {
          type: "object",
          properties: {
            object: { type: "string", enum: ["block"] },
            type: { type: "string" },
            paragraph: { type: "object" },
            heading_1: { type: "object" },
            heading_2: { type: "object" },
            heading_3: { type: "object" },
            bulleted_list_item: { type: "object" },
            numbered_list_item: { type: "object" },
            to_do: { type: "object" },
            toggle: { type: "object" },
            code: { type: "object" },
            quote: { type: "object" },
            callout: { type: "object" },
            divider: { type: "object" },
            table_of_contents: { type: "object" },
            embed: { type: "object" },
            image: { type: "object" },
            video: { type: "object" },
            file: { type: "object" },
            pdf: { type: "object" },
            bookmark: { type: "object" },
            equation: { type: "object" },
            table: { type: "object" },
            table_row: { type: "object" },
            column_list: { type: "object" },
            column: { type: "object" },
            link_preview: { type: "object" },
            synced_block: { type: "object" },
            template: { type: "object" },
            link_to_page: { type: "object" },
            child_page: { type: "object" },
            child_database: { type: "object" },
          },
        },
      },
      after: {
        type: "string",
        description: "ID of the block after which to insert the new blocks",
      },
    },
    required: ["block_id", "children"],
    additionalProperties: false,
  },
};

// User Tools
export const getUserTool: ToolSchema = {
  name: "get_user",
  description: "Retrieve a user by their ID",
  parameters: {
    type: "object",
    properties: {
      user_id: {
        type: "string",
        description: "ID of the user to retrieve",
      },
    },
    required: ["user_id"],
    additionalProperties: false,
  },
};

export const listUsersTool: ToolSchema = {
  name: "list_users",
  description: "List all users in the workspace",
  parameters: {
    type: "object",
    properties: {
      start_cursor: {
        type: "string",
        description: "Cursor for pagination",
      },
      page_size: {
        type: "number",
        description: "Number of users to return",
        minimum: 1,
        maximum: 100,
      },
    },
    required: [],
    additionalProperties: false,
  },
};

export const getSelfTool: ToolSchema = {
  name: "get_self",
  description: "Get details about the current bot user",
  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  },
};

// Comment Tools
export const createCommentTool: ToolSchema = {
  name: "create_comment",
  description: "Create a comment on a page or discussion",
  parameters: {
    type: "object",
    properties: {
      parent: {
        type: "object",
        description: "Parent page where comment will be created",
        properties: {
          page_id: { type: "string", description: "ID of the page" },
          type: { type: "string", enum: ["page_id"], default: "page_id" },
        },
        required: ["page_id"],
      },
      rich_text: {
        type: "array",
        description: "Content of the comment as rich text",
        items: { type: "object" },
      },
      discussion_id: {
        type: "string",
        description: "ID of the discussion thread (for reply comments)",
      },
    },
    required: ["parent", "rich_text"],
    additionalProperties: false,
  },
};

export const listCommentsTool: ToolSchema = {
  name: "list_comments",
  description: "List comments on a page",
  parameters: {
    type: "object",
    properties: {
      block_id: {
        type: "string",
        description: "ID of the block/page to get comments for",
      },
      start_cursor: {
        type: "string",
        description: "Cursor for pagination",
      },
      page_size: {
        type: "number",
        description: "Number of comments to return",
        minimum: 1,
        maximum: 100,
      },
    },
    required: ["block_id"],
    additionalProperties: false,
  },
};

export const getCommentTool: ToolSchema = {
  name: "get_comment",
  description: "Retrieve a comment by its ID",
  parameters: {
    type: "object",
    properties: {
      comment_id: {
        type: "string",
        description: "ID of the comment to retrieve",
      },
    },
    required: ["comment_id"],
    additionalProperties: false,
  },
};

// Search Tool
export const searchTool: ToolSchema = {
  name: "search",
  description: "Search for pages and databases by title",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Text to search for in page and database titles",
      },
      filter: {
        type: "object",
        description: "Filter to limit search to pages or databases",
        properties: {
          property: { type: "string", enum: ["object"] },
          value: { type: "string", enum: ["page", "database"] },
        },
        required: ["property", "value"],
        additionalProperties: false,
      },
      sort: {
        type: "object",
        description: "Sort criteria for search results",
        properties: {
          timestamp: { type: "string", enum: ["last_edited_time"] },
          direction: { type: "string", enum: ["ascending", "descending"] },
        },
        required: ["timestamp", "direction"],
        additionalProperties: false,
      },
      start_cursor: {
        type: "string",
        description: "Cursor for pagination",
      },
      page_size: {
        type: "number",
        description: "Number of results to return",
        minimum: 1,
        maximum: 100,
      },
    },
    required: ["query"],
    additionalProperties: false,
  },
};

// File Upload Tools
export const createFileUploadTool: ToolSchema = {
  name: "create_file_upload",
  description: "Create a file upload session",
  parameters: {
    type: "object",
    properties: {
      mode: {
        type: "string",
        enum: ["external_url"],
        description: "Mode of file upload - either from external URL",
      },
      external_url: {
        type: "string",
        description:
          "URL of the external file to upload (required when mode is 'external_url')",
      },
      file_id: {
        type: "string",
        description: "ID of the file to upload",
      },
      filename: { type: "string", description: "Name of the file" },
      media_type: { type: "string", description: "MIME type of the file" },
    },
    required: ["mode", "filename", "media_type", "file_id"],

    additionalProperties: false,
  },
};

export const getFileUploadTool: ToolSchema = {
  name: "get_file_upload",
  description: "Retrieve file upload details",
  parameters: {
    type: "object",
    properties: {
      file_upload_id: {
        type: "string",
        description: "ID of the file upload",
      },
    },
    required: ["file_upload_id"],
    additionalProperties: false,
  },
};

export const listFileUploadsTool: ToolSchema = {
  name: "list_file_uploads",
  description: "List file uploads",
  parameters: {
    type: "object",
    properties: {
      start_cursor: {
        type: "string",
        description: "Cursor for pagination",
      },
      page_size: {
        type: "number",
        description: "Number of results to return",
        minimum: 1,
        maximum: 100,
      },
    },
    required: [],
    additionalProperties: false,
  },
};

// Export all tools
export const allTools: ToolSchema[] = [
  // Pages
  createPageTool,
  getPageTool,
  updatePageTool,
  getPagePropertyTool,

  // Databases
  createDatabaseTool,
  getDatabaseTool,
  updateDatabaseTool,
  queryDatabaseTool,

  // Blocks
  getBlockTool,
  updateBlockTool,
  deleteBlockTool,
  listBlockChildrenTool,
  appendBlockChildrenTool,

  // Users
  getUserTool,
  listUsersTool,
  getSelfTool,

  // Comments
  createCommentTool,
  listCommentsTool,
  getCommentTool,

  // Search
  searchTool,

  // File Uploads
  createFileUploadTool,
  getFileUploadTool,
  listFileUploadsTool,
];

// Export a function to get tools by category
export function getToolsByCategory(category: string): ToolSchema[] {
  const categoryMap: Record<string, string[]> = {
    pages: ["create_page", "get_page", "update_page", "get_page_property"],
    databases: [
      "create_database",
      "get_database",
      "update_database",
      "query_database",
    ],
    blocks: [
      "get_block",
      "update_block",
      "delete_block",
      "list_block_children",
      "append_block_children",
    ],
    users: ["get_user", "list_users", "get_self"],
    comments: ["create_comment", "list_comments", "get_comment"],
    search: ["search"],
    files: ["create_file_upload", "get_file_upload", "list_file_uploads"],
  };

  const toolNames = categoryMap[category] || [];
  return allTools.filter((tool) => toolNames.includes(tool.name));
}

// Export a function to get a tool by name
export function getToolByName(name: string): ToolSchema | undefined {
  return allTools.find((tool) => tool.name === name);
}
