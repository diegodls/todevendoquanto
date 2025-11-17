import {
  SignInUserInputDTO,
  SignInUserOutputDTO,
} from "@/application/dtos/user/sign-in-dto";
import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

export interface UserSignInControllerInterface {
  handle(
    request: PublicHttpRequestInterface<SignInUserInputDTO>
  ): Promise<PublicHttpResponseInterface<SignInUserOutputDTO>>;
}
