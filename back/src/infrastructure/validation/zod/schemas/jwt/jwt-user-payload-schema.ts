import { JwtPayloadInterface } from "@/core/ports/infrastructure/protocols/jwt/jwt-verify-token-interface";
import z from "zod";

export const JwtPayloadInterfaceSchema = z
  .object({
    email: z.email(),
    role: z.string(),
    sub: z.string(),
    iat: z.number(),
    exp: z.number(),
  })
  .strip() satisfies z.ZodType<JwtPayloadInterface>;
