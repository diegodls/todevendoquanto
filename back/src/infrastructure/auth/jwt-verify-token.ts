import { JwtVerifyTokenInterface } from "@/core/ports/infrastructure/auth/jwt-verify-token-interface";
import { UnauthorizedError } from "@/core/shared/errors/api-errors";
import { jwtAuthErrorCodes } from "@/infrastructure/errors/codes/auth/jwt-auth-errors";

import jwt from "jsonwebtoken";

export class JwtVerifyToken implements JwtVerifyTokenInterface {
  async execute<T>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const jwtSecret = process.env.JWT_PASS ?? "";

      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err)
          return reject(
            new UnauthorizedError(
              "Not authorized",
              {},
              jwtAuthErrorCodes.E_0_MW_JWT_0001.code
            )
          );
        resolve(decoded as T);
      });
    });
  }
}
