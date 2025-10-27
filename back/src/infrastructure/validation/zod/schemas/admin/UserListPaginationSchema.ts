import {
  UserListQueryInput,
  UserListQueryProps,
  UserListRequestDTO,
  UserListRequestPaginatedQuery,
} from "@/application/dtos/admin/UserListDTO";
import { UserRole } from "@/core/domain/User";
import { mergeWithPagination } from "@/infrastructure/validation/zod/shared/schemas/PaginationSchema";
import { z } from "zod";

export const UserListQuerySchema = z
  .object({
    name: z.string().min(2).max(255).optional(),
    email: z.string().email().optional(),
    role: z.nativeEnum(UserRole).default("BASIC").optional(),
    status: z.string(),
    is_active: z.string().pipe(z.coerce.boolean()).optional(),
  })
  .strip() satisfies z.ZodType<UserListQueryProps, any, UserListQueryInput>;

export const FinalUserListPaginationSchema = mergeWithPagination(
  UserListQuerySchema,
  "name"
);

FinalUserListPaginationSchema satisfies z.ZodType<
  UserListRequestDTO,
  any,
  UserListRequestPaginatedQuery
>;
