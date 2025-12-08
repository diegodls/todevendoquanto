import { User } from "../../../../entities/user";

export interface JwtPayloadInterface {
  email: User["email"];
  role: User["role"];
  sub: User["id"];
  iat: number;
  exp: number;
  // when change, need change the express type in "./@types/express/index.ts"
}

export interface JwtVerifyTokenInterface {
  execute<T>(token: string): Promise<T>;
}
