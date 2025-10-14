import { UserRole } from "@/core/domain/User";
import { StringToBoolean } from "@/infrastructure/validation/zod/shared/helpers/StringToBoolean";
import { createPaginationSchema } from "@/infrastructure/validation/zod/shared/schemas/PaginationSchema";
import { z } from "zod";

const userListQuerySchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    email: z.string().email().max(255).optional(),
    role: z.nativeEnum(UserRole).optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    is_active: StringToBoolean.optional(),
  })
  .strip();

const UserListPaginationSchema = createPaginationSchema(
  userListQuerySchema,
  "created_at"
);

export { UserListPaginationSchema };
