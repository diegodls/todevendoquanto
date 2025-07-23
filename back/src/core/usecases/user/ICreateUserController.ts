import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "../../../core/domain/User";
import { HttpRequest, HttpResponse } from "../../../types/HttpRequestResponse";

export interface ICreateUserController {
  handle(
    request: HttpRequest<CreateUserInputDTO>
  ): Promise<HttpResponse<CreateUserOutputDTO>>;
}
