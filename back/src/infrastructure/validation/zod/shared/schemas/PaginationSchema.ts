import {
  PaginationDirection,
  PaginationProps,
  PaginationQueryInput,
} from "@/application/dtos/shared/PaginationDTO";
import { z } from "zod";

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
