import { HttpRequest, HttpResponse } from "../../../types/HttpRequestResponse";

export interface ITestController {
  handle(request: HttpRequest): Promise<HttpResponse>;
}
