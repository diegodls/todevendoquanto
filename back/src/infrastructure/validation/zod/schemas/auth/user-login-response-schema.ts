import { LoginUserOutputDTO } from "@/core/usecases/auth/login-dto";
import z from "zod";

export const UserLoginResponseSchema = z
  .object({
    token: z.string(),
  })
  .strip() satisfies z.ZodType<LoginUserOutputDTO>;
