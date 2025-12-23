import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

export interface PublicControllerInterface<
  B = any,
  H = any,
  P = any,
  Q = any,
  R = any
> {
  handle: (
    request: PublicHttpRequestInterface<B, H, P, Q>
  ) => Promise<PublicHttpResponseInterface<R>>;
}
