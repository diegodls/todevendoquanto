import {
  ListUserOrderByPropsArrKey,
  ListUserOrderDirectionOptions,
  ListUsersFilterProps,
  ListUsersFilterQueryStringInput,
} from "@/core/usecases/user/list-user-dto";
import { StringToBoolean } from "@/infrastructure/validation/zod/helpers/string-to-boolean";
import { toZodEnum } from "@/infrastructure/validation/zod/helpers/to-zod-enum";
import { DateSchema } from "@/infrastructure/validation/zod/schemas/shared/date-schema";
import { PaginationSchema } from "@/infrastructure/validation/zod/schemas/shared/pagination-schema";
import z from "zod";

const ListUserQuerySchema = z
  .object({
    name: z.string().min(2).max(255).optional(),
    email: z.email().optional(),
    roles: z
      .string()
      .transform((value) => value.toUpperCase().split(","))
      .pipe(z.array(z.enum(["BASIC", "ADMIN"])))
      .optional(),
    isActive: StringToBoolean.optional(),
    created_after: DateSchema.optional(),
    created_before: DateSchema.optional(),
    updated_after: DateSchema.optional(),
    updated_before: DateSchema.optional(),
    order: z.enum(ListUserOrderDirectionOptions).optional().default("asc"),
    orderBy: z
      .enum(toZodEnum(ListUserOrderByPropsArrKey))
      .optional()
      .default("name"),
  })
  .strip() satisfies z.ZodType<
  ListUsersFilterProps,
  ListUsersFilterQueryStringInput
>;

export const ListUserSchema = PaginationSchema.extend(ListUserQuerySchema);
