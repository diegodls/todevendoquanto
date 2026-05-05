import { ApiErrorResponseSchema } from "@/infrastructure/validation/zod/schemas/shared/api-error-response-schema";

export function buildOpenApiPath(root: string, path: string) {
  const normalizedRoot = root === "/" ? "" : root;

  if (path === "/" || path === "") {
    return normalizedRoot || "/";
  }

  return `${normalizedRoot}${path}`.replace(
    /:([a-zA-Z0-9_]+)/g,
    "{$1}",
  );
}

export const badRequestResponse = {
  description: "Invalid request data",
  content: {
    "application/json": {
      schema: ApiErrorResponseSchema,
    },
  },
};

export const forbiddenResponse = {
  description: "Authentication required or insufficient permissions",
  content: {
    "application/json": {
      schema: ApiErrorResponseSchema,
    },
  },
};

export const notFoundResponse = {
  description: "Resource not found",
  content: {
    "application/json": {
      schema: ApiErrorResponseSchema,
    },
  },
};

export const unprocessableEntityResponse = {
  description: "Business rule validation failed",
  content: {
    "application/json": {
      schema: ApiErrorResponseSchema,
    },
  },
};

export const internalServerErrorResponse = {
  description: "Internal server error",
  content: {
    "application/json": {
      schema: ApiErrorResponseSchema,
    },
  },
};
