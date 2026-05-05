import { USER_ROUTES_PATH } from "@/core/ports/infrastructure/http/app-routes-paths";
import {
  badRequestResponse,
  buildOpenApiPath,
  forbiddenResponse,
  idParamsSchema,
  internalServerErrorResponse,
  notFoundResponse,
  unprocessableEntityResponse,
} from "@/infrastructure/docs/endpoints/shared-docs";
import { registry } from "@/infrastructure/docs/registry";
import { CreateUserBodySchema } from "@/infrastructure/validation/zod/schemas/user/create-user-body-schema";
import { UpdateUserBodySchema } from "@/infrastructure/validation/zod/schemas/user/update-user-profile-body-schema";
import { z } from "zod";

const UserListQuerySchema = z
  .object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    isActive: z.string().optional(),
    roles: z.string().optional(),
    created_after: z.string().optional(),
    created_before: z.string().optional(),
    updated_after: z.string().optional(),
    updated_before: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: z
      .enum(["name", "email", "role", "createdAt", "updatedAt", "isActive"])
      .optional(),
  })
  .strip();

const CreateUserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.string(),
  isActive: z.boolean(),
});

const UserResponseSchema = CreateUserResponseSchema.extend({
  updatedAt: z.string(),
});

const PaginationMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  totalPages: z.number(),
  totalItems: z.number(),
});

const ListUsersResponseSchema = z.object({
  data: z.array(UserResponseSchema),
  meta: PaginationMetaSchema,
});

export function registerUserDocs() {
  registry.registerPath({
    method: "get",
    path: buildOpenApiPath(USER_ROUTES_PATH.root, USER_ROUTES_PATH.list),
    tags: ["Users"],
    summary: "List users with filters and pagination",
    request: {
      query: UserListQuerySchema,
    },
    responses: {
      200: {
        description: "Users listed successfully",
        content: {
          "application/json": {
            schema: ListUsersResponseSchema,
          },
        },
      },
      400: badRequestResponse,
      403: forbiddenResponse,
      404: notFoundResponse,
    },
  });

  registry.registerPath({
    method: "post",
    path: buildOpenApiPath(USER_ROUTES_PATH.root, USER_ROUTES_PATH.create),
    tags: ["Users"],
    summary: "Create a new user",
    request: {
      body: {
        required: true,
        content: {
          "application/json": {
            schema: CreateUserBodySchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "User created successfully",
        content: {
          "application/json": {
            schema: CreateUserResponseSchema,
          },
        },
      },
      400: badRequestResponse,
      403: forbiddenResponse,
      422: unprocessableEntityResponse,
    },
  });

  registry.registerPath({
    method: "patch",
    path: buildOpenApiPath(USER_ROUTES_PATH.root, USER_ROUTES_PATH.update),
    tags: ["Users"],
    summary: "Update a user profile",
    request: {
      params: idParamsSchema,
      body: {
        required: true,
        content: {
          "application/json": {
            schema: UpdateUserBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "User updated successfully",
        content: {
          "application/json": {
            schema: UserResponseSchema,
          },
        },
      },
      400: badRequestResponse,
      403: forbiddenResponse,
      404: notFoundResponse,
      500: internalServerErrorResponse,
    },
  });

  registry.registerPath({
    method: "delete",
    path: buildOpenApiPath(USER_ROUTES_PATH.root, USER_ROUTES_PATH.delete),
    tags: ["Users"],
    summary: "Delete a user by id",
    request: {
      params: idParamsSchema,
    },
    responses: {
      204: {
        description: "User deleted successfully",
      },
      400: badRequestResponse,
      403: forbiddenResponse,
      404: notFoundResponse,
    },
  });
}
