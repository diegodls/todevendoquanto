import { AUTH_ROUTES_PATH } from "@/core/ports/infrastructure/http/app-routes-paths";
import {
  badRequestResponse,
  buildOpenApiPath,
  forbiddenResponse,
} from "@/infrastructure/docs/endpoints/shared-docs";
import { registry } from "@/infrastructure/docs/registry";
import { UserLoginBodySchema } from "@/infrastructure/validation/zod/schemas/auth/user-login-body-schema";
import { UserLoginResponseSchema } from "@/infrastructure/validation/zod/schemas/auth/user-login-response-schema";

export function registerAuthDocs() {
  registry.registerPath({
    method: "post",
    path: buildOpenApiPath(AUTH_ROUTES_PATH.root, AUTH_ROUTES_PATH.login),
    tags: ["Auth"],
    summary: "User authentication",
    request: {
      body: {
        required: true,
        content: {
          "application/json": {
            schema: UserLoginBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Authentication completed successfully",
        content: {
          "application/json": {
            schema: UserLoginResponseSchema,
          },
        },
      },
      400: badRequestResponse,
      403: {
        ...forbiddenResponse,
        description: "Invalid credentials or deactivated user account",
      },
    },
  });
}
