import {
  PaginationDirection,
  PaginationProps,
  PaginationQueryInput,
} from "@/application/dtos/shared/PaginationDTO";
import { BadRequestError } from "@/core/shared/utils/errors/ApiError";
import { toZodEnum } from "@/infrastructure/validation/zod/shared/helpers/toZodEnum";
import { z } from "zod";

export function createPaginationSchema<T extends readonly string[]>(
  orderByKeys: T,
  defaultOrderBy: T[number]
) {
  if (!orderByKeys.includes(defaultOrderBy)) {
    throw new BadRequestError(`Invalid keyword to sort: ${defaultOrderBy}`);
  }

  return z
    .object({
      page: z
        .string()
        .transform(Number)
        .pipe(z.number().int().positive().default(1))
        .optional(),

      page_size: z
        .string()
        .transform(Number)
        .pipe(z.number().int().positive().max(100).default(20))
        .optional(),

      order: z.enum(PaginationDirection).optional().default("asc"),

      order_by: z
        .enum(toZodEnum(orderByKeys))
        .optional()
        .default(defaultOrderBy),
    })
    .strip() satisfies z.ZodType<
    PaginationProps<T[number]>,
    any,
    PaginationQueryInput
  >;
}

export function mergeWithPagination<T extends z.AnyZodObject>(
  filterSchema: T,
  defaultOrderKey: keyof z.infer<T>
) {
  const filterKeys = Object.keys(filterSchema.shape);

  const validOrderKeys = filterKeys as [string, ...string[]];

  const PaginationSchema = createPaginationSchema(
    validOrderKeys,
    defaultOrderKey as string
  );

  return PaginationSchema.merge(filterSchema);
}
