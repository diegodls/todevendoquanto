import { UserRole } from "@/core/entities/user";
import { UpdateUserInputDTO } from "@/core/usecases/user/update-user-dto";
import { StringToBoolean } from "@/infrastructure/validation/zod/shared/helpers/string-to-boolean";
import { z } from "zod";

export const UserUpdateBodySchema = z.object({
  name: z.string().min(6).max(255).optional(),
  email: z.string().email().optional(),
  role: z
    .string()
    .transform((value) => value.toUpperCase())
    .pipe(z.nativeEnum(UserRole)),
  is_active: StringToBoolean.optional(),
}) as z.ZodType<UpdateUserInputDTO>;
