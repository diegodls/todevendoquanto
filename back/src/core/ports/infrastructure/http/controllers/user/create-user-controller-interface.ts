import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "@/core/usecases/user/create-user-dto";

export interface CreateUserControllerInterface {
  handle(
    request: PublicHttpRequestInterface<CreateUserInputDTO>
  ): Promise<PublicHttpResponseInterface<CreateUserOutputDTO>>;
}
