import {
  ListUserOrderDirectionOptions,
  ListUsersFilterQueryParams,
  ListUsersFiltersOptions,
  ListUsersHttpRequestProps,
  ListUsersOrderByOptionsArrKey,
  ListUsersOrderQueryParams,
  ListUsersOrderRequestOptionalProps,
} from "@/core/usecases/user/list-user-dto";
import { toZodEnum } from "@/infrastructure/validation/zod/helpers/to-zod-enum";
import { DateSchema } from "@/infrastructure/validation/zod/schemas/shared/date-schema";
import { PaginationSchema } from "@/infrastructure/validation/zod/schemas/shared/pagination-schema";
import z from "zod";

const ListUsersFilterOptionsSchema = z
  .object({
    name: z.string().optional(),
    email: z.email().optional(),
    isActive: z.string().transform(Boolean).optional(),
    roles: z
      .string()
      .transform((value) => value.toUpperCase().split(","))
      .optional(),
    created_after: DateSchema.optional(),
    created_before: DateSchema.optional(),
    updated_after: DateSchema.optional(),
    updated_before: DateSchema.optional(),
  })
  .strip() satisfies z.ZodType<
  ListUsersFiltersOptions,
  ListUsersFilterQueryParams
>;

const ListUsersOrderOptionsSchema = z
  .object({
    order: z.string().optional().pipe(z.enum(ListUserOrderDirectionOptions)),
    orderBy: z
      .string()
      .optional()
      .pipe(z.enum(toZodEnum(ListUsersOrderByOptionsArrKey))),
  })
  .strip() satisfies z.ZodType<
  ListUsersOrderRequestOptionalProps,
  ListUsersOrderQueryParams
>;

const ListUserRequestProps = ListUsersOrderOptionsSchema.safeExtend(
  ListUsersFilterOptionsSchema.shape,
);

export const ListUserSchema = ListUserRequestProps.safeExtend(
  PaginationSchema.shape,
) satisfies z.ZodType<ListUsersHttpRequestProps>;
