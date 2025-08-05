import {
  IJWTAuth,
  IUserLoginDecode,
} from "@/core/ports/infrastructure/auth/IJWTAuth";
import jwt from "jsonwebtoken";

class JWTAuth implements IJWTAuth {
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

export { JWTAuth };
