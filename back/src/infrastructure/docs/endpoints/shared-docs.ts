import { z } from "zod";

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

export const bearerAuthSecurity = [{ bearerAuth: [] }] as const;

export const apiErrorResponseSchema = z.object({
  message: z.string(),
  errors: z.record(z.string(), z.string()).optional(),
  appCode: z.string().optional(),
  timestamp: z.string().optional(),
});

export const idParamsSchema = z
  .object({
    id: z.string(),
  })
  .strip();

export const badRequestResponse = {
  description: "Invalid request data",
  content: {
    "application/json": {
      schema: apiErrorResponseSchema,
    },
  },
};

export const forbiddenResponse = {
  description: "Authentication required or insufficient permissions",
  content: {
    "application/json": {
      schema: apiErrorResponseSchema,
    },
  },
};

export const notFoundResponse = {
  description: "Resource not found",
  content: {
    "application/json": {
      schema: apiErrorResponseSchema,
    },
  },
};

export const unprocessableEntityResponse = {
  description: "Business rule validation failed",
  content: {
    "application/json": {
      schema: apiErrorResponseSchema,
    },
  },
};

export const internalServerErrorResponse = {
  description: "Internal server error",
  content: {
    "application/json": {
      schema: apiErrorResponseSchema,
    },
  },
};
