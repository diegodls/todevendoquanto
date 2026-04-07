import { CreateUserControllerInterface } from "@/core/ports/infrastructure/http/controllers/user/create-user-controller-type";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "@/core/usecases/user/create-user-dto";
import { CreateUserUseCaseInterface } from "@/core/usecases/user/create-user-usecase-interface";
import { CreateUserBodySchema } from "@/infrastructure/validation/zod/schemas/user/create-user-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";

export class CreateUserController implements CreateUserControllerInterface {
  constructor(private readonly usecase: CreateUserUseCaseInterface) {}

  async handle(
    request: AuthenticatedHttpRequestInterface<CreateUserInputDTO>,
  ): Promise<AuthenticatedHttpResponseInterface<CreateUserOutputDTO>> {
    const input = requestValidation("body", request, CreateUserBodySchema);

    const createdUser = await this.usecase.execute(input);

    const output: AuthenticatedHttpResponseInterface<CreateUserOutputDTO> = {
      statusCode: 201,
      body: createdUser,
    };

    return output;
  }
}
