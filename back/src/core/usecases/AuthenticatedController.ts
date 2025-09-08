import {
  AuthenticatedHttpRequest,
  AuthenticatedHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

interface AuthenticatedController<B = any, H = any, P = any, Q = any, R = any> {
  handle: (
    request: AuthenticatedHttpRequest<B, H, P, Q>
  ) => Promise<AuthenticatedHttpResponse<R>>;
}

export { AuthenticatedController };
