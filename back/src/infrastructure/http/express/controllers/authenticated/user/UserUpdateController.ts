import {
  UserUpdateInputDTO,
  UserUpdateOutputDTO,
  UserUpdateParams,
} from "@/application/dtos/user/UserUpdateDTO";
import { IUserService } from "@/application/services/user/IUserService";
import { SANITIZE_UUID_V4_REGEX } from "@/core/shared/regex/sanitize_uuid";
import {
  AuthenticatedHttpRequest,
  AuthenticatedHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { BadRequestError } from "@/core/shared/utils/errors/ApiError";
import { IUserUpdateController } from "@/core/usecases/authenticated/user/IUserUpdateController";

import { UserUpdateBodySchema } from "@/infrastructure/validation/zod/schemas/user/UserProfileUpdateBodySchema";
import { requestValidation } from "@/infrastructure/validation/zod/shared/validation/RequestValidation";

class UserUpdateController implements IUserUpdateController {
  constructor(readonly service: IUserService) {}

  public async handle(
    request: AuthenticatedHttpRequest<UserUpdateInputDTO, {}, UserUpdateParams>
  ): Promise<AuthenticatedHttpResponse<UserUpdateOutputDTO>> {
    const userJWT = request.user;

    const userIDToChange = request.params.id;

    if (!String(userIDToChange)) {
      throw new BadRequestError("User ID to change was not send");
    }

    if (!SANITIZE_UUID_V4_REGEX.test(userIDToChange)) {
      throw new BadRequestError("Invalid User ID to change");
    }

    const input = requestValidation<UserUpdateInputDTO>(
      "body",
      request,
      UserUpdateBodySchema
    );

    const updatedUser = await this.service.update(
      userJWT,
      userIDToChange,
      input
    );

    const output: AuthenticatedHttpResponse<UserUpdateOutputDTO> = {
      statusCode: 200,
      body: updatedUser,
    };

    return output;
  }
}

export { UserUpdateController };
