import { AUTH_ROUTES_PATH } from "@/core/ports/infrastructure/http/app-routes-paths";
import { registry } from "@/infrastructure/docs/registry";
import { UserLoginBodySchema } from "@/infrastructure/validation/zod/schemas/auth/user-login-body-schema";

export function registerAuthDocs() {
  registry.registerPath({
    method: "post",
    path: AUTH_ROUTES_PATH.login,
    tags: ["Auth"],
    summary: "User Authentication",
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
        description: "Token generation successfully",
      },
      401: {
        description: "Invalid credentials",
      },
    },
  });
}
