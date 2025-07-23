import jwt from "jsonwebtoken";
import { AuthService, IUserLoginDecode } from "../../core/ports/auth";

class JwtAuthService implements AuthService {
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

export { JwtAuthService };
