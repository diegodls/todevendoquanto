import {
  UserListQueryInput,
  UserListQueryProps,
  UserListRequestDTO,
  UserListRequestPaginatedQuery,
} from "@/application/dtos/admin/UserListDTO";
import { UserRole } from "@/core/domain/User";
import { createExactSchema } from "@/infrastructure/validation/zod/shared/helpers/CreateExactSchema";
import { StringToBoolean } from "@/infrastructure/validation/zod/shared/helpers/StringToBoolean";
import { mergeWithPagination } from "@/infrastructure/validation/zod/shared/schemas/PaginationSchema";
import { z } from "zod";

const DateSchema = z
  .string()
  .pipe(z.coerce.date())
  .refine((date) => !Number.isNaN(date.getTime()), {
    message: "Invalid date format. Please, use ISO 8601 format.",
  });

const createUserSchema = createExactSchema<UserListQueryProps>();

const UserListQuerySchema = createUserSchema({
  name: z.string().min(2).max(255).optional(),
  email: z.string().email().optional(),
  roles: z
    .string()
    .transform((value) => value.toUpperCase().split(","))
    .pipe(z.array(z.nativeEnum(UserRole)))
    .default("BASIC")
    .optional(),
  is_active: StringToBoolean.optional(),
  created_after: DateSchema.optional(),
  created_before: DateSchema.optional(),
  updated_after: DateSchema.optional(),
  updated_before: DateSchema.optional(),
}).strip() satisfies z.ZodType<UserListQueryProps, any, UserListQueryInput>;

export const FinalUserListPaginationSchema = mergeWithPagination(
  UserListQuerySchema,
  "name"
);

FinalUserListPaginationSchema satisfies z.ZodType<
  UserListRequestDTO,
  any,
  UserListRequestPaginatedQuery
>;
