import { z } from "zod";

export function zodSchemaKeys<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): readonly (keyof T)[] {
  return Object.keys(schema.shape) as (keyof T)[];
}

export type SchemaKeys<T extends z.ZodObject<any>> = keyof z.infer<T>;
