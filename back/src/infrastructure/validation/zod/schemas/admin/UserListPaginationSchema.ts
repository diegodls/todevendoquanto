import {
  UserFiltersPropsInput,
  UserFiltersQueryInput,
  UserListRequestDTO,
  UserListRequestPaginatedQuery,
} from "@/application/dtos/admin/UserListDTO";
import { mergeWithPagination } from "@/infrastructure/validation/zod/shared/schemas/PaginationSchema";
import { z } from "zod";

export const UserListQuerySchema = z
  .object({
    name: z.string().min(2).max(255).optional(),
  })
  .strip() satisfies z.ZodType<
  UserFiltersPropsInput,
  any,
  UserFiltersQueryInput
>;

export const FinalUserListPaginationSchema =
  mergeWithPagination(UserListQuerySchema);

FinalUserListPaginationSchema satisfies z.ZodType<
  UserListRequestDTO,
  any,
  UserListRequestPaginatedQuery
>;
