import { UserRole } from "@/core/entities/user";
import {
  ListUsersQueryInput,
  ListUsersQueryProps,
  ListUsersRequestDTO,
  UserListRequestPaginatedQuery,
} from "@/core/usecases/user/list-user-dto";
import { createExactSchema } from "@/infrastructure/validation/zod/helpers/create-exact-schema";
import { StringToBoolean } from "@/infrastructure/validation/zod/helpers/string-to-boolean";
import { mergeWithPagination } from "@/infrastructure/validation/zod/schemas/shared/pagination-schema";
import z from "zod";

const DateSchema = z
  .string()
  .pipe(z.coerce.date())
  .refine((date) => !Number.isNaN(date.getTime()), {
    message: "Invalid date format. Please, use ISO 8601 format.",
  });

const createUserSchema = createExactSchema<ListUsersQueryProps>();

const UserListQuerySchema = createUserSchema({
  name: z.string().min(2).max(255).optional(),
  email: z.email().optional(),
  roles: z
    .string()
    .transform((value) => value.toUpperCase().split(","))
    .pipe(z.array(z.enum(UserRole)))
    .default(["BASIC"])
    .optional(),
  isActive: StringToBoolean.optional(),
  created_after: DateSchema.optional(),
  created_before: DateSchema.optional(),
  updated_after: DateSchema.optional(),
  updated_before: DateSchema.optional(),
}).strip() satisfies z.ZodType<ListUsersQueryProps, ListUsersQueryInput>;

export const FinalUserListPaginationSchema = mergeWithPagination(
  UserListQuerySchema,
  "name"
);

FinalUserListPaginationSchema satisfies z.ZodType<
  ListUsersRequestDTO,
  UserListRequestPaginatedQuery
>;
