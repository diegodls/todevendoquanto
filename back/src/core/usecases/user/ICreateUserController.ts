import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "@/application/dtos/CreateUserDTO";
import {
  HttpRequest,
  HttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

export interface ICreateUserController {
  handle(
    request: HttpRequest<CreateUserInputDTO>
  ): Promise<HttpResponse<CreateUserOutputDTO>>;
}
