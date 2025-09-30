import { UserUpdateInputDTO } from "@/application/dtos/user/UserUpdateDTO";
import { UserRole } from "@/core/domain/User";
import { z } from "zod";

const UserUpdateBodySchema = z.object({
  name: z.string().min(6).max(256).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(UserRole).optional(),
  is_active: z.boolean().optional(),
}) satisfies z.ZodType<UserUpdateInputDTO>;

export { UserUpdateBodySchema };
