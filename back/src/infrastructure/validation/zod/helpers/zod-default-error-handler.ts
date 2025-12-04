import { z } from "zod";
export const zodDefaultErrorHandler: z.core.$ZodErrorMap = (issue) => {
  if (!issue.input) return `You must pass a valid ${issue.path}`;

  if (issue.code === "invalid_type") return `Invalid type of ${issue.path}`;

  if (issue.code === "invalid_format") return `Invalid format of ${issue.path}`;
};
