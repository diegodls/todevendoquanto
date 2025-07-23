import {
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "../../../core/domain/User";
import { HttpRequest, HttpResponse } from "../../../types/HttpRequestResponse";

interface IUserLoginController {
  handle(
    request: HttpRequest<UserLoginInputDTO>
  ): Promise<HttpResponse<UserLoginOutputDTO> | null>;
}

export { IUserLoginController };
