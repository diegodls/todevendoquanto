interface JwtPayloadInterface {
  email: User["email"];
  role: User["role"];
  sub: User["id"];
  iat: number;
  exp: number;
}

declare namespace Express {
  export interface Request {
    user?: JwtPayloadInterface;
  }
}
