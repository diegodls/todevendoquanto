import {
  PaginationDirection,
  PaginationProps,
  PaginationQueryStringInput,
} from "@/application/dtos/shared/pagination-dto";
import { BadRequestError } from "@/core/shared/errors/api-errors";

import { toZodEnum } from "@/infrastructure/validation/zod/helpers/to-zod-enum";
import z from "zod";

export function createPaginationSchema<T extends readonly string[]>(
  orderByKeys: T,
  defaultOrderBy: T[number],
) {
  if (!orderByKeys.includes(defaultOrderBy)) {
    throw new BadRequestError(`Invalid keyword to sort: ${defaultOrderBy}`);
  }

  return z
    .object({
      page: z
        .string()
        .transform(Number)
        .optional()
        .pipe(z.number().int().positive().default(1)),

      pageSize: z
        .string()
        .transform(Number)
        .optional()
        .pipe(z.number().int().positive().max(100).default(20)),

      order: z.enum(PaginationDirection).optional().default("asc"),

      orderBy: z
        .enum(toZodEnum(orderByKeys))
        .optional()
        .default(defaultOrderBy),
    })
    .strip() satisfies z.ZodType<
    PaginationProps<T[number]>,
    PaginationQueryStringInput
  >;
}

export function mergeWithPagination<T extends z.ZodObject>(
  filterSchema: T,
  defaultOrderKey: keyof z.infer<T>,
) {
  const filterKeys = Object.keys(filterSchema.shape);

  const validOrderKeys = filterKeys as [string, ...string[]];

  const PaginationSchema = createPaginationSchema(
    validOrderKeys,
    defaultOrderKey as string,
  );

  return PaginationSchema.extend(filterSchema);
}
