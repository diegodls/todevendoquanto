import {
  PublicHttpRequest,
  PublicHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

export interface ITestController {
  handle(request: PublicHttpRequest): Promise<PublicHttpResponse>;
}
