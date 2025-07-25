
import { IUserLoginDecode, JWTAuth } from '@/core/ports/infrastructure/middlewares/JWTAuth';
import jwt from "jsonwebtoken";

class JWTAuthMiddleware
 implements JWTAuth {
  async verifyToken(token: string): Promise<IUserLoginDecode> {
    return new Promise((resolve, reject) => {
      const jwtSecret = process.env.JWT_PASS ?? "";
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) return reject(new Error("Invalid token"));
        resolve(decoded as IUserLoginDecode);
      });
    });
  }
}

export { JWTAuthMiddleware };

