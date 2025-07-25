import {
  HttpRequest,
  HttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

export interface ITestController {
  handle(request: HttpRequest): Promise<HttpResponse>;
}
