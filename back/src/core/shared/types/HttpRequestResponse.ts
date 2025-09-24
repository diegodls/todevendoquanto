import { IJwtPayload } from "@/core/ports/infrastructure/auth/IJWTAuth";

interface PublicHttpRequest<B = any, H = any, P = any, Q = any> {
  body: B;
  headers: H;
  params: P;
  query: Q;
}

interface PublicHttpResponse<T = any> {
  statusCode: number;
  body: T;
}

interface AuthenticatedHttpRequest<B = any, H = any, P = any, Q = any>
  extends PublicHttpRequest<B, H, P, Q> {
  user: IJwtPayload;
}

interface AuthenticatedHttpResponse<T = any> {
  statusCode: number;
  body: T;
}

export {
  AuthenticatedHttpRequest,
  AuthenticatedHttpResponse,
  PublicHttpRequest,
  PublicHttpResponse,
};
