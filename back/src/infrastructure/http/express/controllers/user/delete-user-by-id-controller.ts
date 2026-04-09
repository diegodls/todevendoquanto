import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDOutputDTO,
} from "@/core/usecases/user/delete-user-dto";

import { DeleteUserByIDControllerType } from "@/core/ports/infrastructure/http/controllers/user/delete-user-by-id-controller-type";
import { DeleteUserUseCaseInterface } from "@/core/usecases/user/delete-user-usecase-interface";
import { DeleteUserByIDParamsSchema } from "@/infrastructure/validation/zod/schemas/user/delete-user-by-id-params-schema";
import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";

export class DeleteUserByIDController implements DeleteUserByIDControllerType {
  constructor(private readonly usecase: DeleteUserUseCaseInterface) {}
  public async handle(
    request: AuthenticatedHttpRequestInterface<DeleteUserByIDInputDTO>,
  ): Promise<AuthenticatedHttpResponseInterface<DeleteUserByIDOutputDTO>> {
    const requestUserId = request.user.sub;

    const { id } = requestValidation(
      "params",
      request,
      DeleteUserByIDParamsSchema,
    );

    const input: DeleteUserByIDInputDTO = {
      requestingUserId: requestUserId,
      targetUserId: id,
    };

    await this.usecase.execute(input);

    const output: AuthenticatedHttpResponseInterface<DeleteUserByIDOutputDTO> =
      {
        statusCode: 204,
        body: {},
      };

    return output;
  }
}
