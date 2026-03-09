import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDOutputDTO,
} from "@/core/usecases/user/delete-user-dto";

import { DeleteUserByIDControllerType } from "@/core/ports/infrastructure/http/controllers/user/delete-user-by-id-controller-type";
import { BadRequestError } from "@/core/shared/errors/api-errors";
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

    const deletedUser = await this.usecase.execute(input);

    if (!deletedUser) {
      throw new BadRequestError("User to be deleted not found");
    }

    const output: AuthenticatedHttpResponseInterface<DeleteUserByIDOutputDTO> =
      {
        statusCode: 200,
        body: { id: deletedUser.id },
      };

    return output;
  }
}
