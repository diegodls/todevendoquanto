import {
  ListUsersFilterProps,
  ListUsersFilterQueryStringInput,
  ListUsersRequestPaginatedQuery,
  ListUsersRequestQueryProps,
} from "@/core/usecases/user/list-user-dto";
import { createExactSchema } from "@/infrastructure/validation/zod/helpers/create-exact-schema";
import { StringToBoolean } from "@/infrastructure/validation/zod/helpers/string-to-boolean";
import { DateSchema } from "@/infrastructure/validation/zod/schemas/shared/date-schema";
import { mergeWithPagination } from "@/infrastructure/validation/zod/schemas/shared/pagination-schema";
import z from "zod";

const createUserSchema = createExactSchema<ListUsersFilterProps>();

const ListUserQuerySchema = createUserSchema({
  name: z.string().min(2).max(255).optional(),
  email: z.email().optional(),
  roles: z
    .string()
    .transform((value) => value.toUpperCase().split(","))
    .pipe(z.array(z.enum(["BASIC", "ADMIN"])))
    //.default(["BASIC", "ADMIN"])
    .optional(),
  isActive: StringToBoolean.optional(),
  created_after: DateSchema.optional(),
  created_before: DateSchema.optional(),
  updated_after: DateSchema.optional(),
  updated_before: DateSchema.optional(),
}).strip() satisfies z.ZodType<
  ListUsersFilterProps,
  ListUsersFilterQueryStringInput
>;

export const ListUserPaginationSchema = mergeWithPagination(
  ListUserQuerySchema,
  "name",
);

ListUserPaginationSchema satisfies z.ZodType<
  ListUsersRequestQueryProps,
  ListUsersRequestPaginatedQuery
>;
