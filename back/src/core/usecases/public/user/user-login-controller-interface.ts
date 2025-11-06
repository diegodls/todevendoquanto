import {
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "@/application/dtos/user/user-login-dto";
import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

export interface UserLoginControllerInterface {
  handle(
    request: PublicHttpRequestInterface<UserLoginInputDTO>
  ): Promise<PublicHttpResponseInterface<UserLoginOutputDTO> | null>;
}
