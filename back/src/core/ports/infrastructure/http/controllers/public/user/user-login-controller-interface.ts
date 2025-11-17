import {
  LoginUserInputDTO,
  LoginUserOutputDTO,
} from "@/application/dtos/user/login-dto";
import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

export interface UserLoginControllerInterface {
  handle(
    request: PublicHttpRequestInterface<LoginUserInputDTO>
  ): Promise<PublicHttpResponseInterface<LoginUserOutputDTO> | null>;
}
