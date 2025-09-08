import {
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "@/application/dtos/UserLoginDTO";
import {
  PublicHttpRequest,
  PublicHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

interface IUserLoginController {
  handle(
    request: PublicHttpRequest<UserLoginInputDTO>
  ): Promise<PublicHttpResponse<UserLoginOutputDTO> | null>;
}

export { IUserLoginController };
