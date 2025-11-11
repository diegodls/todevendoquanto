import { User } from "../../../entities/user";

export interface JwtPayloadInterface {
  email: User["email"];
  role: User["role"];
  sub: User["id"];
  iat: number;
  exp: number;
}

export interface JWTAuthInterface {
  verifyToken<T>(token: string): Promise<T>;
}
