import { UserUpdateControllerType } from "@/core/ports/infrastructure/http/controllers/user/update-user-controller-type";
import { BadRequestError } from "@/core/shared/errors/api-errors";
import { SANITIZE_UUID_V4_REGEX } from "@/core/shared/regex/sanitize-uuid";
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
  UserUpdateBodySchema,
  UserUpdateParamsSchema,
} from "@/infrastructure/validation/zod/schemas/user/user-profile-update-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";

export class UserUpdateController implements UserUpdateControllerType {
  constructor(readonly service: UpdateUserUseCaseInterface) {}

  public async handle(
    request: AuthenticatedHttpRequestInterface<
      UpdateUserInputDTO,
      {},
      UpdateUserInputParams
    >
  ): Promise<AuthenticatedHttpResponseInterface<UpdateUserOutputDTO>> {
    const loggedUser = request.user;

    const userIDToChange = requestValidation(
      "params",
      request,
      UserUpdateParamsSchema
    ).id;

    if (!String(userIDToChange)) {
      throw new BadRequestError("User ID to change was not send");
    }

    if (!SANITIZE_UUID_V4_REGEX.test(userIDToChange)) {
      throw new BadRequestError("Invalid User ID to change");
    }

    const input = requestValidation("body", request, UserUpdateBodySchema);

    const updatedUser = await this.service.execute(
      loggedUser,
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
