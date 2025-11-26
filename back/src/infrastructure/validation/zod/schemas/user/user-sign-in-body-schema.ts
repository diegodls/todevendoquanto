import {
  CreateUserInputDTO,
  CreateUserInputProps,
} from "@/core/usecases/user/create-user-dto";
import z from "zod";

export const CreateUserBodySchema = z
  .object({
    name: z
      .string({
        error: (err) => {
          if (!err.input) return `You must pass a valid ${err.path}`;

          if (err.code === "invalid_type") return `Invalid type of ${err.path}`;

          if (err.code === "invalid_format")
            return `Invalid format of ${err.path}`;
        },
      })
      .min(3, { message: "Name must have 3 or more caracteres" }),

    email: z.email({
      error: (err) => {
        if (!err.input) return `You must pass a valid ${err.path}`;

        if (err.code === "invalid_type") return `Invalid type of ${err.path}`;

        if (err.code === "invalid_format")
          return `Invalid format of ${err.path}`;
      },
    }),

    password: z
      .string({
        error: (err) => {
          if (!err.input) return `You must pass a valid ${err.path}`;

          if (err.code === "invalid_type") return `Invalid type of ${err.path}`;

          if (err.code === "invalid_format")
            return `Invalid format of ${err.path}`;
        },
      })
      .min(6, "Password must have 6 or more caracteres"),
  })
  .strip() satisfies z.ZodType<CreateUserInputDTO, CreateUserInputProps>;
