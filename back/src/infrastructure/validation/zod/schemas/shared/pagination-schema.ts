import {
  PaginationProps,
  PaginationQueryStringInput,
} from "@/application/dtos/shared/pagination-dto";

import z from "zod";

export const PaginationSchema = z
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
      .pipe(z.number().int().positive().max(100).default(10)),
  })
  .strip() satisfies z.ZodType<PaginationProps, PaginationQueryStringInput>;
