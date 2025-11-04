import { User } from "../../../domain/User";

export interface IJwtPayload {
  email: User["email"];
  role: User["role"];
  sub: User["id"];
  iat: number;
  exp: number;
}

export interface IJWTAuth {
  verifyToken<T>(token: string): Promise<T>;
}
