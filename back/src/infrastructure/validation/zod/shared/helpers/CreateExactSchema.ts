import { z } from "zod";

export function createExactSchema<T>() {
  return <S extends z.ZodRawShape>(
    shape: S & { [K in Exclude<keyof S, keyof T>]: never }
  ): z.ZodObject<S> => {
    return z.object(shape);
  };
}
