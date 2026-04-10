import { UserUpdateControllerType } from "@/core/ports/infrastructure/http/controllers/user/update-user-controller-type";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import {
  UpdateUserInputDTO,
  UpdateUserInputParams,
  UpdateUserOutputDTO,
} from "@/core/usecases/user/update-user-dto";
import { UpdateUserUseCaseInterface } from "@/core/usecases/user/update-user-usecase-interface";
import {
  UpdateUserBodySchema,
  UpdateUserParamsSchema,
} from "@/infrastructure/validation/zod/schemas/user/update-user-profile-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";

export class UserUpdateController implements UserUpdateControllerType {
  constructor(private readonly usecase: UpdateUserUseCaseInterface) {}

  public async handle(
    request: AuthenticatedHttpRequestInterface<
      UpdateUserInputDTO,
      {},
      UpdateUserInputParams
    >,
  ): Promise<AuthenticatedHttpResponseInterface<UpdateUserOutputDTO>> {
    const { id } = requestValidation("params", request, UpdateUserParamsSchema);

    const input = requestValidation("body", request, UpdateUserBodySchema);

    const inputData: UpdateUserInputDTO = {
      requestingUserId: request.user.sub,
      targetUserId: id,
      ...input,
    };

    const updatedUser = await this.usecase.execute(inputData);

    const output: AuthenticatedHttpResponseInterface<UpdateUserOutputDTO> = {
      statusCode: 200,
      body: updatedUser,
    };

    return output;
  }
}
