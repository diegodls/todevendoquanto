import { IJWTAuth } from "@/core/ports/infrastructure/auth/IJWTAuth";
import { UnauthorizedError } from "@/core/shared/utils/errors/ApiError";
import { MiddlewareJWTAuthCodes } from "@/core/shared/utils/errors/codes/middleware/middlewareJWTAuth";
import jwt from "jsonwebtoken";

export class JWTAuth implements IJWTAuth {
  async verifyToken<T>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const jwtSecret = process.env.JWT_PASS ?? "";

      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err)
          return reject(
            new UnauthorizedError(
              "Not authorized",
              {},
              MiddlewareJWTAuthCodes.E_0_MW_JWT_0001.code
            )
          );
        resolve(decoded as T);
      });
    });
  }
}
