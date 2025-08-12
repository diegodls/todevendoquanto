import { User } from "../../../domain/User";

interface JwtPayload {
  email: User["email"];
  role: User["role"];
  sub: User["id"];
  iat: number;
  exp: number;
}

interface IJWTAuth {
  verifyToken<T>(token: string): Promise<T>;
}

export { IJWTAuth, JwtPayload };
