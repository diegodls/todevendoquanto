import { UserUpdateInputDTO } from "@/application/dtos/user/UserUpdateDTO";
import { UserRole } from "@/core/domain/User";
import { StringToBoolean } from "@/infrastructure/validation/zod/shared/helpers/StringToBoolean";
import { z } from "zod";

export const UserUpdateBodySchema = z.object({
  name: z.string().min(6).max(255).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(UserRole).optional(),
  is_active: StringToBoolean.optional(),
}) as z.ZodType<UserUpdateInputDTO>;
