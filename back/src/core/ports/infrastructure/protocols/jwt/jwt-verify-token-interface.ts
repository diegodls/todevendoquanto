export interface JwtPayloadInterface {
  email: string;
  role: string;
  sub: string;
  iat: number;
  exp: number;
  // when change, need change the express type in "./@types/express/index.ts"
}

export interface JwtVerifyTokenInterface {
  execute<T>(token: string): Promise<T>;
}
