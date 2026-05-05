import { z } from "zod";

type ApiErrorResponseDTO = {
  message: string;
  errors?: Record<string, string>;
  appCode?: string;
  timestamp?: string;
};

export const ApiErrorResponseSchema = z
  .object({
    message: z.string(),
    errors: z.record(z.string(), z.string()).optional(),
    appCode: z.string().optional(),
    timestamp: z.string().optional(),
  })
  .strip() satisfies z.ZodType<ApiErrorResponseDTO>;
