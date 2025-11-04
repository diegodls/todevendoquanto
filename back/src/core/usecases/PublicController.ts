import {
  PublicHttpRequest,
  PublicHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

export interface PublicController<B = any, H = any, P = any, Q = any, R = any> {
  handle: (
    request: PublicHttpRequest<B, H, P, Q>
  ) => Promise<PublicHttpResponse<R>>;
}
