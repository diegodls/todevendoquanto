import {
  PaginationProps,
  PaginationQueryInput,
} from "@/application/dtos/shared/PaginationDTO";
import { z } from "zod";

export const PaginationSchema = z.object({
  page: z
    .string()
    .optional() // Permite undefined na entrada
    .transform((val) => (val !== undefined ? Number(val) : undefined)) // Transforma string para number|undefined
    .pipe(z.number().int().positive().optional()) // Valida a saída como number|undefined
    .optional(), // Garante que o tipo de SAÍDA é opcional.
}) satisfies z.ZodType<PaginationProps, any, PaginationQueryInput>;

export function mergeWithPagination<T extends z.AnyZodObject>(filterSchema: T) {
  return PaginationSchema.merge(filterSchema);
}

/*


page_size: z
        .string()
        .transform(Number)
        .pipe(z.number().int().positive().max(100).default(20)),

page_size: z.coerce.number().int().positive().max(100).default(20),

page: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive())
    .default(1),

page: z.coerce.number().int().positive().optional().default(1),

page: z
    .preprocess(
      (val) => (val === undefined ? "1" : val),
      z
        .string()
        .transform((val) => Number.parseInt(val, 10))
        .pipe(z.number().int().positive())
    )
    .optional(),

    page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => {
      return Number.parseInt(val, 10);
    })
    .pipe(z.number().int().positive())
    .optional()
    .default(1),
*/
