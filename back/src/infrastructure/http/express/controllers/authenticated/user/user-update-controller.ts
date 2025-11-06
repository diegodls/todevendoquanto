import {
  UserUpdateInputDTO,
  UserUpdateParams,
  UserUpdateOutputDTO,
} from "@/application/dtos/user/user-update-dto";
import { UserServiceInterface } from "@/core/ports/application/services/user-service-interface";
import { SANITIZE_UUID_V4_REGEX } from "@/core/shared/regex/sanitize-uuid";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import { BadRequestError } from "@/core/shared/utils/errors/api-error";
import { UserUpdateControllerType } from "@/core/usecases/authenticated/user/user-update-controller-type";
import { UserUpdateBodySchema } from "@/infrastructure/validation/zod/schemas/user/user-profile-update-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/shared/validation/request-validation";

export class UserUpdateController implements UserUpdateControllerType {
  constructor(readonly service: UserServiceInterface) {}

  public async handle(
    request: AuthenticatedHttpRequestInterface<
      UserUpdateInputDTO,
      {},
      UserUpdateParams
    >
  ): Promise<AuthenticatedHttpResponseInterface<UserUpdateOutputDTO>> {
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

    const output: AuthenticatedHttpResponseInterface<UserUpdateOutputDTO> = {
      statusCode: 200,
      body: updatedUser,
    };

    return output;
  }
}
