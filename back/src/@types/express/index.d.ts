interface JwtPayloadInterface {
  email: string;
  role: string;
  sub: string;
  iat: number;
  exp: number;
}

declare namespace Express {
  export interface Request {
    user?: JwtPayloadInterface;
  }
}
