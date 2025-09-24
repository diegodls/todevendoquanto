import {
  UserSignInInputDTO,
  UserSignInOutputDTO,
} from "@/application/dtos/user/UserSignInDTO";
import {
  PublicHttpRequest,
  PublicHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

export interface IUserSignInController {
  handle(
    request: PublicHttpRequest<UserSignInInputDTO>
  ): Promise<PublicHttpResponse<UserSignInOutputDTO>>;
}
