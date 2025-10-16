import {
  UserFiltersPropsInput,
  UserFiltersQueryInput,
} from "@/application/dtos/admin/UserListDTO";
import { createPaginationSchema } from "@/infrastructure/validation/zod/shared/schemas/PaginationSchema";
import { z } from "zod";

/*
const userListQuerySchema2 = z
  .object({
    name: z.string().min(1).max(255).optional(),
    email: z.string().email().max(255).optional(),
    role: z.nativeEnum(UserRole).optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    is_active: StringToBoolean.optional(),
  })
  .strip();

type OT = {
  page?: Date;
};

type IT = PaginationParamsToQueryString<OT>;

const TestSchema = z.object({
  page: z.string().transform(Date).pipe(z.date()).optional(),
}) satisfies z.ZodType<OT, any, IT>;
*/
export const userListQuerySchema = z
  .object({
    name: z.string().email().max(255).optional(),
    /*
    email: z.string().email().max(255).optional(),
    role: z.nativeEnum(UserRole).optional(),
    created_at: z.string().transform(Date).pipe(z.date()).optional(),
    updated_at: z.string().transform(Date).pipe(z.date()).optional(),
    is_active: z.string().transform(Boolean).pipe(z.boolean()).optional(),
    */
  })
  .strip() satisfies z.ZodType<
  UserFiltersPropsInput,
  any,
  UserFiltersQueryInput
>;
/*
 */

export const UserListPaginationSchema = createPaginationSchema(
  userListQuerySchema,
  "name"
);
