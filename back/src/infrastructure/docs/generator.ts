import { registerAuthDocs } from "@/infrastructure/docs/endpoints/auth-docs";
import { registry } from "@/infrastructure/docs/registry";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

export function generateOpenApiDocs() {
  registerAuthDocs();
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "todevendoquanto",
      description: "Api routes documentation",
    },
    servers: [{ url: "/api/v1" }],
  });
}
