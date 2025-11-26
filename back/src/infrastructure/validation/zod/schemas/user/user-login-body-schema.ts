import {
  LoginUserInputDTO,
  LoginUserInputQuery,
} from "@/core/usecases/user/login-dto";
import z from "zod";

export const UserLoginBodySchema = z
  .object({
    email: z.email({
      error: (err) => {
        if (!err.input) return `You must pass a valid ${err.path}`;

        if (err.code === "invalid_type") return `Invalid type of ${err.path}`;

        if (err.code === "invalid_format")
          return `Invalid format of ${err.path}`;
      },
    }),

    password: z.string({
      error: (err) => {
        if (!err.input) return `You must pass a valid ${err.path}`;

        if (err.code === "invalid_type") return `Invalid type of ${err.path}`;

        if (err.code === "invalid_format")
          return `Invalid format of ${err.path}`;
      },
    }),
  })
  .strip() satisfies z.ZodType<LoginUserInputQuery, LoginUserInputDTO>;
