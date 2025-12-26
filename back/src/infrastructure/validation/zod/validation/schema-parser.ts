import { BadRequestError } from "@/core/shared/errors/api-errors";
import z from "zod";

export const schemaParser = <T, TypeSchema extends z.ZodSchema<any, any>>(
  data: T,
  schema: TypeSchema,
  errorCode: string
): z.output<TypeSchema> => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: Record<string, string> = {};

    for (const err of result.error.issues) {
      const errorPath = err.path[0].toLocaleString();
      errors[errorPath] = err.message;
    }

    throw new BadRequestError("Error on data validation", errors, errorCode);
  }

  return result.data;
};
