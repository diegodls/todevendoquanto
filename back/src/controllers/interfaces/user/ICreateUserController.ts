import { CreateUserDTO } from "../../../entities/User";
import { HttpRequest, HttpResponse } from "../../../types/HttpRequestResponse";

export interface ICreateUserController {
  handle(request: HttpRequest<CreateUserDTO>): Promise<HttpResponse>;
}
