import { DOCS_ROUTES_PATH } from "@/core/ports/infrastructure/http/app-routes-paths";
import {
  buildOpenApiPath,
  forbiddenResponse,
} from "@/infrastructure/docs/endpoints/shared-docs";
import { registry } from "@/infrastructure/docs/registry";
import { OpenApiDocumentSchema } from "@/infrastructure/validation/zod/schemas/docs/open-api-document-schema";

export function registerDocsRoutesDocs() {
  registry.registerPath({
    method: "get",
    path: buildOpenApiPath(DOCS_ROUTES_PATH.root, DOCS_ROUTES_PATH.docs),
    tags: ["Docs"],
    summary: "Open Swagger UI documentation",
    responses: {
      200: {
        description: "Swagger UI page rendered successfully",
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: buildOpenApiPath(DOCS_ROUTES_PATH.root, DOCS_ROUTES_PATH.json),
    tags: ["Docs"],
    summary: "Get OpenAPI document as JSON",
    responses: {
      200: {
        description: "OpenAPI document returned successfully",
        content: {
          "application/json": {
            schema: OpenApiDocumentSchema,
          },
        },
      },
      403: forbiddenResponse,
    },
  });
}
