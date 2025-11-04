import {
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "@/application/dtos/user/UserLoginDTO";
import {
  PublicHttpRequest,
  PublicHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

export interface IUserLoginController {
  handle(
    request: PublicHttpRequest<UserLoginInputDTO>
  ): Promise<PublicHttpResponse<UserLoginOutputDTO> | null>;
}
