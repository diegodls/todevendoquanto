import { UserUpdateControllerType } from "@/core/ports/infrastructure/http/controllers/authenticated/user/user-update-controller-type";
import { SANITIZE_UUID_V4_REGEX } from "@/core/shared/regex/sanitize-uuid";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import { BadRequestError } from "@/core/shared/utils/errors/api-error";
import {
  UpdateUserInputDTO,
  UpdateUserOutputDTO,
  UpdateUserParams,
} from "@/core/usecases/user/update-user-dto";
import { UpdateUserUseCaseInterface } from "@/core/usecases/user/update-user-usecase-interface";
import { UserUpdateBodySchema } from "@/infrastructure/validation/zod/schemas/user/user-profile-update-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/shared/validation/request-validation";

export class UserUpdateController implements UserUpdateControllerType {
  constructor(readonly service: UpdateUserUseCaseInterface) {}

  public async handle(
    request: AuthenticatedHttpRequestInterface<
      UpdateUserInputDTO,
      {},
      UpdateUserParams
    >
  ): Promise<AuthenticatedHttpResponseInterface<UpdateUserOutputDTO>> {
    const userJWT = request.user;

    const userIDToChange = request.params.id;

    if (!String(userIDToChange)) {
      throw new BadRequestError("User ID to change was not send");
    }

    if (!SANITIZE_UUID_V4_REGEX.test(userIDToChange)) {
      throw new BadRequestError("Invalid User ID to change");
    }

    const input = requestValidation("body", request, UserUpdateBodySchema);

    const updatedUser = await this.service.update(
      userJWT,
      userIDToChange,
      input
    );

    const output: AuthenticatedHttpResponseInterface<UpdateUserOutputDTO> = {
      statusCode: 200,
      body: updatedUser,
    };

    return output;
  }
}
