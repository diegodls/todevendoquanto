import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "@/application/dtos/CreateUserDTO";
import {
  PublicHttpRequest,
  PublicHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

export interface ICreateUserController {
  handle(
    request: PublicHttpRequest<CreateUserInputDTO>
  ): Promise<PublicHttpResponse<CreateUserOutputDTO>>;
}
