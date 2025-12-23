import { UserLoginControllerInterface } from "@/core/ports/infrastructure/http/controllers/auth/user-login-controller-interface";
import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import {
  LoginUserInputDTO,
  LoginUserOutputDTO,
} from "@/core/usecases/auth/login-dto";
import { LoginUseCase } from "@/core/usecases/auth/login-usecase";
import { UserLoginBodySchema } from "@/infrastructure/validation/zod/schemas/auth/user-login-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";

export class UserLoginController implements UserLoginControllerInterface {
  constructor(private readonly usecase: LoginUseCase) {}

  public async handle(
    request: PublicHttpRequestInterface<LoginUserInputDTO>
  ): Promise<PublicHttpResponseInterface<LoginUserOutputDTO>> {
    const input = requestValidation("body", request, UserLoginBodySchema);

    const token = await this.usecase.execute(input);

    const output: PublicHttpResponseInterface<LoginUserOutputDTO> = {
      statusCode: 200,
      body: token,
    };

    return output;
  }
}
