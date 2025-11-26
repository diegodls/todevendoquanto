import { JwtPayloadInterface } from "@/core/ports/infrastructure/auth/jwt-verify-token-interface";

export interface PublicHttpRequestInterface<
  B = any,
  H = any,
  P = any,
  Q = any
> {
  body: B;
  headers: H;
  params: P;
  query: Q;
}

export interface PublicHttpResponseInterface<T = any> {
  statusCode: number;
  body: T;
}

export interface AuthenticatedHttpRequestInterface<
  B = any,
  H = any,
  P = any,
  Q = any
> extends PublicHttpRequestInterface<B, H, P, Q> {
  user: JwtPayloadInterface;
}

export interface AuthenticatedHttpResponseInterface<T = any> {
  statusCode: number;
  body: T;
}
