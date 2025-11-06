import { BadRequestError } from "@/core/shared/utils/errors/api-error";

export function toZodEnum<T extends readonly string[]>(
  values: T
): [T[number], ...T[number][]] {
  if (values.length === 0) {
    throw new BadRequestError("Sort list is empty");
  }

  return values as unknown as [T[number], ...T[number][]];
}
