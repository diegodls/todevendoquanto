import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDOutputDTO,
} from "@/core/usecases/user/delete-user-dto";

import { DeleteUserByIDControllerType } from "@/core/ports/infrastructure/http/controllers/authenticated/user/user-delete-by-id-controller-type";
import { BadRequestError } from "@/core/shared/errors/api-errors";
import { DeleteUserUseCaseInterface } from "@/core/usecases/user/delete-user-usecase-interface";
import { UserDeleteByIDParamsSchema } from "@/infrastructure/validation/zod/schemas/admin/user-delete-by-id-params-schema";
import { requestValidation } from "@/infrastructure/validation/zod/shared/validation/request-validation";

export class DeleteUserByIDController implements DeleteUserByIDControllerType {
  constructor(private readonly usecase: DeleteUserUseCaseInterface) {}
  public async handle(
    request: AuthenticatedHttpRequestInterface<DeleteUserByIDInputDTO>
  ): Promise<AuthenticatedHttpResponseInterface<DeleteUserByIDOutputDTO>> {
    const adminUser = request.user;

    const input = requestValidation(
      "params",
      request,
      UserDeleteByIDParamsSchema
    );

    const deletedUser = await this.usecase.execute(adminUser.sub);

    if (!deletedUser) {
      throw new BadRequestError("User to be deleted not found");
    }

    const output: AuthenticatedHttpResponseInterface<DeleteUserByIDOutputDTO> =
      {
        statusCode: 200,
        body: { deletedId: deletedUser.id },
      };

    return output;
  }
}
