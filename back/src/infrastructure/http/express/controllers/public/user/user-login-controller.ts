import { UserLoginControllerInterface } from "@/core/ports/infrastructure/http/controllers/public/user/user-login-controller-interface";
import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import {
  LoginUserInputDTO,
  LoginUserOutputDTO,
} from "@/core/usecases/user/login-dto";
import { UpdateUserUseCase } from "@/core/usecases/user/update-user-usecase";
import { UserLoginBodySchema } from "@/infrastructure/validation/zod/schemas/user/user-login-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/shared/validation/request-validation";

export class UserLoginController implements UserLoginControllerInterface {
  constructor(private readonly service: UpdateUserUseCase) {}

  public async handle(
    request: PublicHttpRequestInterface<LoginUserInputDTO>
  ): Promise<PublicHttpResponseInterface<LoginUserOutputDTO> | null> {
    const input = requestValidation("body", request, UserLoginBodySchema);

    const token = await this.service.login(input);

    const output: PublicHttpResponseInterface<LoginUserOutputDTO> = {
      statusCode: 200,
      body: token,
    };

    return output;
  }
}
