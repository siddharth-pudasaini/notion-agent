import { z } from "zod";

export type get_Get__user = typeof get_Get__user;
export const get_Get__user = {
  method: z.literal("GET"),
  path: z.literal("/v1/users/{user_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      user_id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Get__users = typeof get_Get__users;
export const get_Get__users = {
  method: z.literal("GET"),
  path: z.literal("/v1/users"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      start_cursor: z.string().optional(),
      page_size: z.number().optional(),
    }),
  }),
  response: z.unknown(),
};

export type get_Get__self = typeof get_Get__self;
export const get_Get__self = {
  method: z.literal("GET"),
  path: z.literal("/v1/users/me"),
  requestFormat: z.literal("json"),
  parameters: z.never(),
  response: z.object({
    object: z.string().optional(),
    id: z.string().optional(),
    name: z.string().optional(),
    avatar_url: z.unknown().optional(),
    type: z.string().optional(),
    bot: z
      .object({
        owner: z
          .object({
            type: z.string().optional(),
            user: z
              .object({
                object: z.string().optional(),
                id: z.string().optional(),
                name: z.string().optional(),
                avatar_url: z.unknown().optional(),
                type: z.string().optional(),
                person: z
                  .object({
                    email: z.string().optional(),
                  })
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
  }),
};

export type post_Post__database__query = typeof post_Post__database__query;
export const post_Post__database__query = {
  method: z.literal("POST"),
  path: z.literal("/v1/databases/{database_id}/query"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      filter_properties: z.array(z.string()).optional(),
    }),
    path: z.object({
      database_id: z.string(),
    }),
    body: z.object({
      filter: z.record(z.string(), z.unknown()).optional(),
      sorts: z
        .array(
          z.object({
            property: z.string(),
            direction: z.union([
              z.literal("ascending"),
              z.literal("descending"),
            ]),
          })
        )
        .optional(),
      start_cursor: z.string().optional(),
      page_size: z.number().optional(),
      archived: z.boolean().optional(),
      in_trash: z.boolean().optional(),
    }),
  }),
  response: z.unknown(),
};

export type post_Post__search = typeof post_Post__search;
export const post_Post__search = {
  method: z.literal("POST"),
  path: z.literal("/v1/search"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      query: z.string().optional(),
      sort: z
        .object({
          direction: z.string().optional(),
          timestamp: z.string().optional(),
        })
        .optional(),
      filter: z
        .object({
          value: z.string().optional(),
          property: z.string().optional(),
        })
        .optional(),
      start_cursor: z.string().optional(),
      page_size: z.number().optional(),
    }),
  }),
  response: z.unknown(),
};

export type get_Get__block__children = typeof get_Get__block__children;
export const get_Get__block__children = {
  method: z.literal("GET"),
  path: z.literal("/v1/blocks/{block_id}/children"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      start_cursor: z.string().optional(),
      page_size: z.number().optional(),
    }),
    path: z.object({
      block_id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type patch_Patch__block__children = typeof patch_Patch__block__children;
export const patch_Patch__block__children = {
  method: z.literal("PATCH"),
  path: z.literal("/v1/blocks/{block_id}/children"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      block_id: z.string(),
    }),
    body: z.object({
      children: z.array(
        z.object({
          paragraph: z
            .object({
              rich_text: z.array(
                z.object({
                  text: z.object({
                    content: z.string(),
                    link: z
                      .union([
                        z.union([
                          z.object({
                            url: z.string(),
                          }),
                          z.null(),
                        ]),
                        z.undefined(),
                      ])
                      .optional(),
                  }),
                  type: z.union([z.literal("text"), z.undefined()]).optional(),
                })
              ),
            })
            .optional(),
          bulleted_list_item: z
            .object({
              rich_text: z.array(
                z.object({
                  text: z.object({
                    content: z.string(),
                    link: z
                      .union([
                        z.union([
                          z.object({
                            url: z.string(),
                          }),
                          z.null(),
                        ]),
                        z.undefined(),
                      ])
                      .optional(),
                  }),
                  type: z.union([z.literal("text"), z.undefined()]).optional(),
                })
              ),
            })
            .optional(),
          type: z
            .union([z.literal("paragraph"), z.literal("bulleted_list_item")])
            .optional(),
        })
      ),
      after: z.union([z.string(), z.undefined()]).optional(),
    }),
  }),
  response: z.unknown(),
};

export type get_Retrieve__a__block = typeof get_Retrieve__a__block;
export const get_Retrieve__a__block = {
  method: z.literal("GET"),
  path: z.literal("/v1/blocks/{block_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      block_id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type patch_Update__a__block = typeof patch_Update__a__block;
export const patch_Update__a__block = {
  method: z.literal("PATCH"),
  path: z.literal("/v1/blocks/{block_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      block_id: z.string(),
    }),
    body: z.object({
      type: z.object({}).optional(),
      archived: z.boolean().optional(),
    }),
  }),
  response: z.unknown(),
};

export type delete_Delete__a__block = typeof delete_Delete__a__block;
export const delete_Delete__a__block = {
  method: z.literal("DELETE"),
  path: z.literal("/v1/blocks/{block_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      block_id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Retrieve__a__page = typeof get_Retrieve__a__page;
export const get_Retrieve__a__page = {
  method: z.literal("GET"),
  path: z.literal("/v1/pages/{page_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      filter_properties: z.string().optional(),
    }),
    path: z.object({
      page_id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type patch_Patch__page = typeof patch_Patch__page;
export const patch_Patch__page = {
  method: z.literal("PATCH"),
  path: z.literal("/v1/pages/{page_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      page_id: z.string(),
    }),
    body: z.object({
      properties: z
        .object({
          title: z.array(
            z.object({
              text: z.object({
                content: z.string(),
                link: z
                  .union([
                    z.union([
                      z.object({
                        url: z.string(),
                      }),
                      z.null(),
                    ]),
                    z.undefined(),
                  ])
                  .optional(),
              }),
              type: z.union([z.literal("text"), z.undefined()]).optional(),
            })
          ),
          type: z.union([z.literal("title"), z.undefined()]).optional(),
        })
        .optional(),
      in_trash: z.boolean().optional(),
      archived: z.boolean().optional(),
      icon: z
        .object({
          emoji: z.string(),
        })
        .optional(),
      cover: z
        .object({
          external: z.object({
            url: z.string(),
          }),
          type: z.union([z.literal("external"), z.undefined()]).optional(),
        })
        .optional(),
    }),
  }),
  response: z.unknown(),
};

export type post_Post__page = typeof post_Post__page;
export const post_Post__page = {
  method: z.literal("POST"),
  path: z.literal("/v1/pages"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      parent: z.object({
        page_id: z.string(),
      }),
      properties: z.object({
        title: z.array(
          z.object({
            text: z.object({
              content: z.string(),
            }),
          })
        ),
        type: z.union([z.literal("title"), z.undefined()]).optional(),
      }),
      children: z.union([z.array(z.string()), z.undefined()]).optional(),
      icon: z.union([z.string(), z.undefined()]).optional(),
      cover: z.union([z.string(), z.undefined()]).optional(),
    }),
  }),
  response: z.unknown(),
};

export type post_Create__a__database = typeof post_Create__a__database;
export const post_Create__a__database = {
  method: z.literal("POST"),
  path: z.literal("/v1/databases"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      parent: z.object({
        type: z.literal("page_id"),
        page_id: z.string(),
      }),
      properties: z.record(z.string(), z.unknown()),
      title: z
        .union([
          z.array(
            z.object({
              text: z.object({
                content: z.string(),
                link: z
                  .union([
                    z.union([
                      z.object({
                        url: z.string(),
                      }),
                      z.null(),
                    ]),
                    z.undefined(),
                  ])
                  .optional(),
              }),
              type: z.union([z.literal("text"), z.undefined()]).optional(),
            })
          ),
          z.undefined(),
        ])
        .optional(),
    }),
  }),
  response: z.unknown(),
};

export type patch_Update__a__database = typeof patch_Update__a__database;
export const patch_Update__a__database = {
  method: z.literal("PATCH"),
  path: z.literal("/v1/databases/{database_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      database_id: z.string(),
    }),
    body: z.object({
      title: z
        .array(
          z.object({
            text: z.object({
              content: z.string(),
              link: z
                .union([
                  z.union([
                    z.object({
                      url: z.string(),
                    }),
                    z.null(),
                  ]),
                  z.undefined(),
                ])
                .optional(),
            }),
            type: z.union([z.literal("text"), z.undefined()]).optional(),
          })
        )
        .optional(),
      description: z
        .array(
          z.object({
            text: z.object({
              content: z.string(),
              link: z
                .union([
                  z.union([
                    z.object({
                      url: z.string(),
                    }),
                    z.null(),
                  ]),
                  z.undefined(),
                ])
                .optional(),
            }),
            type: z.union([z.literal("text"), z.undefined()]).optional(),
          })
        )
        .optional(),
      properties: z
        .object({
          name: z.string().optional(),
        })
        .optional(),
    }),
  }),
  response: z.unknown(),
};

export type get_Retrieve__a__database = typeof get_Retrieve__a__database;
export const get_Retrieve__a__database = {
  method: z.literal("GET"),
  path: z.literal("/v1/databases/{database_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    path: z.object({
      database_id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Retrieve__a__page__property =
  typeof get_Retrieve__a__page__property;
export const get_Retrieve__a__page__property = {
  method: z.literal("GET"),
  path: z.literal("/v1/pages/{page_id}/properties/{property_id}"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      page_size: z.number().optional(),
      start_cursor: z.string().optional(),
    }),
    path: z.object({
      page_id: z.string(),
      property_id: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type get_Retrieve__a__comment = typeof get_Retrieve__a__comment;
export const get_Retrieve__a__comment = {
  method: z.literal("GET"),
  path: z.literal("/v1/comments"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    query: z.object({
      block_id: z.string(),
      start_cursor: z.union([z.string(), z.undefined()]).optional(),
      page_size: z.union([z.number(), z.undefined()]).optional(),
    }),
  }),
  response: z.unknown(),
};

export type post_Create__a__comment = typeof post_Create__a__comment;
export const post_Create__a__comment = {
  method: z.literal("POST"),
  path: z.literal("/v1/comments"),
  requestFormat: z.literal("json"),
  parameters: z.object({
    body: z.object({
      parent: z.object({
        page_id: z.string(),
      }),
      rich_text: z.array(
        z.object({
          text: z.object({
            content: z.string(),
          }),
        })
      ),
    }),
  }),
  response: z.unknown(),
};

// <EndpointByMethod>
export const EndpointByMethod = {
  get: {
    "/v1/users/{user_id}": get_Get__user,
    "/v1/users": get_Get__users,
    "/v1/users/me": get_Get__self,
    "/v1/blocks/{block_id}/children": get_Get__block__children,
    "/v1/blocks/{block_id}": get_Retrieve__a__block,
    "/v1/pages/{page_id}": get_Retrieve__a__page,
    "/v1/databases/{database_id}": get_Retrieve__a__database,
    "/v1/pages/{page_id}/properties/{property_id}":
      get_Retrieve__a__page__property,
    "/v1/comments": get_Retrieve__a__comment,
  },
  post: {
    "/v1/databases/{database_id}/query": post_Post__database__query,
    "/v1/search": post_Post__search,
    "/v1/pages": post_Post__page,
    "/v1/databases": post_Create__a__database,
    "/v1/comments": post_Create__a__comment,
  },
  patch: {
    "/v1/blocks/{block_id}/children": patch_Patch__block__children,
    "/v1/blocks/{block_id}": patch_Update__a__block,
    "/v1/pages/{page_id}": patch_Patch__page,
    "/v1/databases/{database_id}": patch_Update__a__database,
  },
  delete: {
    "/v1/blocks/{block_id}": delete_Delete__a__block,
  },
};
export type EndpointByMethod = typeof EndpointByMethod;
// </EndpointByMethod>

// <EndpointByMethod.Shorthands>
export type GetEndpoints = EndpointByMethod["get"];
export type PostEndpoints = EndpointByMethod["post"];
export type PatchEndpoints = EndpointByMethod["patch"];
export type DeleteEndpoints = EndpointByMethod["delete"];
// </EndpointByMethod.Shorthands>

// <ApiClientTypes>
export type EndpointParameters = {
  body?: unknown;
  query?: Record<string, unknown>;
  header?: Record<string, unknown>;
  path?: Record<string, unknown>;
};

export type MutationMethod = "post" | "put" | "patch" | "delete";
export type Method = "get" | "head" | "options" | MutationMethod;

type RequestFormat = "json" | "form-data" | "form-url" | "binary" | "text";

export type DefaultEndpoint = {
  parameters?: EndpointParameters | undefined;
  response: unknown;
  responseHeaders?: Record<string, unknown>;
};

export type Endpoint<TConfig extends DefaultEndpoint = DefaultEndpoint> = {
  operationId: string;
  method: Method;
  path: string;
  requestFormat: RequestFormat;
  parameters?: TConfig["parameters"];
  meta: {
    alias: string;
    hasParameters: boolean;
    areParametersRequired: boolean;
  };
  response: TConfig["response"];
  responseHeaders?: TConfig["responseHeaders"];
};


