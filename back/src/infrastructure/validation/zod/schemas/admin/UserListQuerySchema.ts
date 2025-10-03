import {
  ListUsersControllerFilters,
  PaginationInputDTO,
} from "@/application/dtos/shared/PaginationDTO";
import { User, UserRole } from "@/core/domain/User";
import { z } from "zod";

const FORBIDDEN_SORT_FIELDS: [keyof User] = ["password"];

const orderByZodSchema = z
  .object({})
  .catchall(
    z
      .enum(["asc", "desc"], {
        invalid_type_error: "You must pass a valid type like asc or desc",
        message:
          "Error on validation order by, you need pass the order like asc or desc",
      })
      .optional()
  )
  .refine(
    (orderBy) => {
      const keys = Object.keys(orderBy) as (keyof User)[];

      const hasForbiddenFields = keys.some((key) =>
        FORBIDDEN_SORT_FIELDS.includes(key)
      );

      return !hasForbiddenFields;
    },
    {
      message: "Unable to sort with the fields provided",
    }
  );

const UserListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().positive().max(100).default(20),
  order_by: orderByZodSchema.optional().default({ name: "asc" }),
  filters: z
    .object({
      is_active: z.boolean().default(true).optional(),
      email: z.string().email("You must pass a valid email").optional(),
      role: z.nativeEnum(UserRole).optional(),
    })
    .optional(),
}) satisfies z.ZodType<PaginationInputDTO<User, ListUsersControllerFilters>>;

export { UserListQuerySchema };
