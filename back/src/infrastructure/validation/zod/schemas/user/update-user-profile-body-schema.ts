import { UserRole } from "@/core/entities/user/user";
import {
  UpdateUserInputDTO,
  UpdateUserInputParams,
} from "@/core/usecases/user/update-user-dto";
import { StringToBoolean } from "@/infrastructure/validation/zod/helpers/string-to-boolean";
import z from "zod";

export const UpdateUserParamsSchema = z
  .object({
    id: z.string({
      error: (err) => {
        if (!err.input) return `You must pass a valid ${err.path}`;

        if (err.code === "invalid_type") return `Invalid type of ${err.path}`;

        if (err.code === "invalid_format")
          return `Invalid format of ${err.path}`;
      },
    }),
  })
  .strip() satisfies z.ZodType<UpdateUserInputParams>;

export const UpdateUserBodySchema = z
  .object({
    name: z.string().min(6).max(255).optional(),
    email: z.email().optional(),
    role: z
      .string()
      .transform((value) => value.toUpperCase())
      .pipe(z.enum(UserRole)),
    isActive: StringToBoolean.optional(),
  })
  .strip() satisfies z.ZodType<UpdateUserInputDTO>;
