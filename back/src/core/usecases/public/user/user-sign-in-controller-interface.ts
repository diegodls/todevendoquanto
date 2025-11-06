import {
  UserSignInInputDTO,
  UserSignInOutputDTO,
} from "@/application/dtos/user/user-sign-in-dto";
import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

export interface UserSignInControllerInterface {
  handle(
    request: PublicHttpRequestInterface<UserSignInInputDTO>
  ): Promise<PublicHttpResponseInterface<UserSignInOutputDTO>>;
}
