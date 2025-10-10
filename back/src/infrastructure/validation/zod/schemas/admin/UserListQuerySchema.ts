import { User, UserRole, UserValidPropsToOrderBy } from "@/core/domain/User";
import { ListUsersControllerPaginationInput } from "@/core/usecases/authenticated/user/IUserListController";
import { StringToBoolean } from "@/infrastructure/validation/zod/shared/StringToBoolean";
import { z } from "zod";

const FORBIDDEN_SORT_FIELDS: [keyof User] = ["password"];

const test: (keyof UserValidPropsToOrderBy)[] = ["name", "created_at"];
// !USAR ISSO AQUI PARA FAZER O FORBIDDEN_SORT_FIELDS, OU COLOCAR O TYPE DELE LÁ NO USER

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

const UserListQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    page_size: z.coerce.number().int().positive().max(100).default(20),
    order_by: orderByZodSchema.optional().default({ name: "asc" }),
    name: z.string().min(1).max(255).optional(),
    email: z.string().email().max(255).optional(),
    role: z.nativeEnum(UserRole).optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    is_active: StringToBoolean.optional(),
  })
  .strip() as z.ZodType<ListUsersControllerPaginationInput>;

export { UserListQuerySchema };
