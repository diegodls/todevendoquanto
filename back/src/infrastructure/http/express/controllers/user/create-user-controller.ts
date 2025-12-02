import { InternalError } from "@/core/shared/errors/api-errors";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "@/core/usecases/user/create-user-dto";
import { CreateUserUseCase } from "@/core/usecases/user/create-user-usecase";
import { userControllerErrorCodes } from "@/infrastructure/errors/codes/controllers/user/user-error-codes";
import { CreateUserBodySchema } from "@/infrastructure/validation/zod/schemas/user/user-sign-in-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";

export class CreateUserController {
  constructor(private readonly usecase: CreateUserUseCase) {}

  async handle(
    request: AuthenticatedHttpRequestInterface<{}, {}, CreateUserInputDTO>
  ): Promise<AuthenticatedHttpResponseInterface<CreateUserOutputDTO>> {
    const input = requestValidation("body", request, CreateUserBodySchema);

    const createdUser = await this.usecase.execute(input);

    if (!createdUser) {
      throw new InternalError(
        "Internal Server Error",
        {},
        userControllerErrorCodes.E_0_CTR_USR_0001.code
      );
    }

    const { password, ...userOutput } = createdUser;

    const output: AuthenticatedHttpResponseInterface<CreateUserOutputDTO> = {
      statusCode: 200,
      body: userOutput,
    };

    return output;
  }
}
