import { CreateUserDTO } from "../entities/User";
import { HttpRequest, HttpResponse } from "../types/https";

export interface ICreateUserController {
  handle(request: HttpRequest<CreateUserDTO>): Promise<HttpResponse>;
}
