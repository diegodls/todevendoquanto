import { JwtGenerateTokenInterface } from "@/core/ports/infrastructure/jwt/jwt-generate-token-interface";
import { InternalError } from "@/core/shared/errors/api-errors";
import { jwtAuthErrorCodes } from "@/infrastructure/errors/codes/auth/jwt-errors";
import jwt, { SignOptions } from "jsonwebtoken";

export class JwtGenerateToken implements JwtGenerateTokenInterface {
  execute(
    payload: string | object | Buffer<ArrayBufferLike>,
    subject: string
  ): string {
    const secret = process.env.JWT_PASS;

    if (!secret) {
      throw new InternalError(
        "Internal Server Error, try again latter",
        {},
        jwtAuthErrorCodes.E_0_MW_JWT_0002.code
      );
    }

    const tokenExpireTime: SignOptions["expiresIn"] = "8h";

    return jwt.sign(payload, secret, {
      subject,
      expiresIn: tokenExpireTime,
    });
  }
}
