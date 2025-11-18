import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import {
  LoginUserInputDTO,
  LoginUserOutputDTO,
} from "@/core/usecases/user/login-dto";

export interface UserLoginControllerInterface {
  handle(
    request: PublicHttpRequestInterface<LoginUserInputDTO>
  ): Promise<PublicHttpResponseInterface<LoginUserOutputDTO> | null>;
}
