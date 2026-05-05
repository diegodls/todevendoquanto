import z from "zod";

type OpenApiDocumentDTO = {
  openapi: string;
  info: {
    version: string;
    title: string;
    description: string;
  };
} & Record<string, unknown>;

export const OpenApiDocumentSchema = z
  .object({
    openapi: z.string(),
    info: z.object({
      version: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  })
  .passthrough() satisfies z.ZodType<OpenApiDocumentDTO>;
