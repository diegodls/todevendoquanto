import {
  AuthenticatedHttpRequest,
  AuthenticatedHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

export interface IAuthenticatedController<B, H, P, Q, R> {
  handle: (
    request: AuthenticatedHttpRequest<B, H, P, Q>
  ) => Promise<AuthenticatedHttpResponse<R>>;
}
