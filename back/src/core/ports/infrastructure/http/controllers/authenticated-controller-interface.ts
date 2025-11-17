import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

export interface AuthenticatedControllerInterface<B, H, P, Q, R> {
  handle: (
    request: AuthenticatedHttpRequestInterface<B, H, P, Q>
  ) => Promise<AuthenticatedHttpResponseInterface<R>>;
}
