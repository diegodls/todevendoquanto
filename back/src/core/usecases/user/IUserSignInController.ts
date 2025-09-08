import {
  UserSignInInputDTO,
  UserSignInOutputDTO,
} from "@/application/dtos/UserSignInDTO";
import {
  PublicHttpRequest,
  PublicHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

export interface IUserSignInController {
  handle(
    request: PublicHttpRequest<UserSignInInputDTO>
  ): Promise<PublicHttpResponse<UserSignInOutputDTO>>;
}
