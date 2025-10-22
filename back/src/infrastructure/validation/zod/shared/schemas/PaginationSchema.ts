import {
  PaginationDirection,
  PaginationProps,
  PaginationQueryInput,
} from "@/application/dtos/shared/PaginationDTO";
import { BadRequestError } from "@/core/shared/utils/errors/ApiError";
import { toZodEnum } from "@/infrastructure/validation/zod/shared/helpers/toZodEnum";
import { z } from "zod";
import { de } from 'zod/v4/locales';

export function createPaginationSchema<T extends readonly string[]>(
  orderByKeys: T,
  defaultOrderBy: T[number]
) {
  if (!orderByKeys.includes(defaultOrderBy)) {
    throw new BadRequestError(`Invalid keyword to sort: ${defaultOrderBy}`);
  }

  return z.object({
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

    order_by: z.enum(toZodEnum(orderByKeys)).optional().default(defaultOrderBy),
  }) satisfies z.ZodType<PaginationProps<T[number]>, any, PaginationQueryInput>;
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

  PAREI AQUI, TEM QUE VER SE ESSE "defaultOrderKey as string" é uma boa ou se dá pra fazer de outra maneira
  apesar de que será usado somente aqui
  Depois tem que fazer o repository com o "orderBy: { XYZ : ZYX}"

  return PaginationSchema.merge(filterSchema);
}

/* // ! # 

export const PaginationSchema = z.object({
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
}) satisfies z.ZodType<PaginationProps, any, PaginationQueryInput>;

export function mergeWithPagination<T extends z.AnyZodObject>(filterSchema: T) {
  return PaginationSchema.merge(filterSchema);
}


*/
