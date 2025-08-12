import { JwtPayload } from "@/core/ports/infrastructure/auth/IJWTAuth";

interface HttpRequest<B = any, H = any, P = any, Q = any> {
  body: B;
  headers: H;
  params: P;
  query: Q;
}

interface HttpResponse<T = any> {
  statusCode: number;
  body: T;
}

interface AuthenticatedHttpRequest<B = any, H = any, P = any, Q = any>
  extends HttpRequest<B, H, P, Q> {
  user: JwtPayload;
}

export { AuthenticatedHttpRequest, HttpRequest, HttpResponse };
