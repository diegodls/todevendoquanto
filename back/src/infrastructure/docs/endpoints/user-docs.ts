import { USER_ROUTES_PATH } from "@/core/ports/infrastructure/http/app-routes-paths";
import {
  badRequestResponse,
  buildOpenApiPath,
  forbiddenResponse,
  internalServerErrorResponse,
  notFoundResponse,
  unprocessableEntityResponse,
} from "@/infrastructure/docs/endpoints/shared-docs";
import { registry } from "@/infrastructure/docs/registry";
import { CreateUserBodySchema } from "@/infrastructure/validation/zod/schemas/user/create-user-body-schema";
import { DeleteUserByIDParamsSchema } from "@/infrastructure/validation/zod/schemas/user/delete-user-by-id-params-schema";
import { ListUserResponseSchema } from "@/infrastructure/validation/zod/schemas/user/list-user-response-schema";
import { ListUserSchema } from "@/infrastructure/validation/zod/schemas/user/list-user-schema";
import { CreateUserResponseSchema } from "@/infrastructure/validation/zod/schemas/user/create-user-response-schema";
import {
  UpdateUserBodySchema,
  UpdateUserParamsSchema,
} from "@/infrastructure/validation/zod/schemas/user/update-user-profile-body-schema";
import { UpdateUserResponseSchema } from "@/infrastructure/validation/zod/schemas/user/update-user-response-schema";

export function registerUserDocs() {
  registry.registerPath({
    method: "get",
    path: buildOpenApiPath(USER_ROUTES_PATH.root, USER_ROUTES_PATH.list),
    tags: ["Users"],
    summary: "List users with filters and pagination",
    request: {
      query: ListUserSchema,
    },
    responses: {
      200: {
        description: "Users listed successfully",
        content: {
          "application/json": {
            schema: ListUserResponseSchema,
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
      params: UpdateUserParamsSchema,
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
            schema: UpdateUserResponseSchema,
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
      params: DeleteUserByIDParamsSchema,
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
