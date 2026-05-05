import { PaginatedResponseMeta } from "@/application/dtos/shared/pagination-dto";
import {
  ListUserOutputDTO,
  ListUserOutputProps,
} from "@/core/usecases/user/list-user-dto";
import z from "zod";

export const ListUserOutputItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.string(),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strip() satisfies z.ZodType<ListUserOutputProps>;

export const PaginationMetaSchema = z
  .object({
    page: z.number(),
    pageSize: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
    totalPages: z.number(),
    totalItems: z.number(),
  })
  .strip() satisfies z.ZodType<PaginatedResponseMeta>;

export const ListUserResponseSchema = z
  .object({
    data: z.array(ListUserOutputItemSchema),
    meta: PaginationMetaSchema,
  })
  .strip() satisfies z.ZodType<ListUserOutputDTO>;
