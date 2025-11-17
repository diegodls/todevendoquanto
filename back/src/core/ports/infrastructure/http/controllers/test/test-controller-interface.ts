import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

export interface TestControllerInterface {
  handle(
    request: PublicHttpRequestInterface
  ): Promise<PublicHttpResponseInterface>;
}
