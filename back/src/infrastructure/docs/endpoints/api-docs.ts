import { API_ROUTES_PATH } from "@/core/ports/infrastructure/http/app-routes-paths";
import {
  buildOpenApiPath,
  forbiddenResponse,
  internalServerErrorResponse,
} from "@/infrastructure/docs/endpoints/shared-docs";
import { registry } from "@/infrastructure/docs/registry";
import { z } from "zod";

const TestRouteResponseSchema = z.object({
  message: z.string(),
});

const ErrorRouteBodySchema = z
  .object({
    where: z
      .string()
      .optional()
      .describe(
        "Use 'controller' or 'service' to force an internal error for tests.",
      ),
  })
  .strip();

const ErrorRouteResponseSchema = z.object({
  where: z.string(),
});

export function registerApiDocs() {
  registry.registerPath({
    method: "get",
    path: buildOpenApiPath(API_ROUTES_PATH.root, API_ROUTES_PATH.test),
    tags: ["API"],
    summary: "Test authenticated admin route",
    responses: {
      200: {
        description: "Route executed successfully",
        content: {
          "application/json": {
            schema: TestRouteResponseSchema,
          },
        },
      },
      403: forbiddenResponse,
    },
  });

  registry.registerPath({
    method: "get",
    path: buildOpenApiPath(API_ROUTES_PATH.root, API_ROUTES_PATH.error),
    tags: ["API"],
    summary: "Trigger controlled errors for testing",
    request: {
      body: {
        required: false,
        content: {
          "application/json": {
            schema: ErrorRouteBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Returns the received payload when no test error is triggered",
        content: {
          "application/json": {
            schema: ErrorRouteResponseSchema,
          },
        },
      },
      403: forbiddenResponse,
      500: {
        ...internalServerErrorResponse,
        description:
          "Internal test error triggered when 'where' is missing, 'controller', or 'service'",
      },
    },
  });
}
