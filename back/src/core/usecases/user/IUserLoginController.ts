import {
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "@/application/dtos/UserLoginDTO";
import {
  HttpRequest,
  HttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

interface IUserLoginController {
  handle(
    request: HttpRequest<UserLoginInputDTO>
  ): Promise<HttpResponse<UserLoginOutputDTO> | null>;
}

export { IUserLoginController };
