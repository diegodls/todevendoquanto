import {
  PaginationRequestProps,
  PaginationRequestQueryProps,
} from "@/application/dtos/shared/pagination-dto";
import z from "zod";

export const PaginationSchema = z
  .object({
    page: z.string().transform(Number).optional(),
    pageSize: z.string().transform(Number).optional(),
  })
  .strip() satisfies z.ZodType<
  PaginationRequestProps,
  PaginationRequestQueryProps
>;
