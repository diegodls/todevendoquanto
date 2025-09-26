import {
  UserUpdateInputDTO,
  UserUpdateOutputDTO,
} from "@/application/dtos/user/UserUpdateDTO";
import { IUserService } from "@/application/services/user/IUserService";
import {
  AuthenticatedHttpRequest,
  AuthenticatedHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { BadRequestError } from "@/core/shared/utils/errors/ApiError";
import { userControllerErrorCodes } from "@/core/shared/utils/errors/codes/user/userErrorCodes";
import { IUserUpdateController } from "@/core/usecases/authenticated/user/IUserUpdateController";

import { bodyValidation } from "@/infrastructure/validation/zod/BodyValidation";
import { UserUpdateBodySchema } from "@/infrastructure/validation/zod/schemas/user/UserProfileUpdateBodySchema";

class UserUpdateController implements IUserUpdateController {
  constructor(readonly service: IUserService) {}

  public async handle(
    request: AuthenticatedHttpRequest<UserUpdateInputDTO>
  ): Promise<AuthenticatedHttpResponse<UserUpdateOutputDTO>> {
    const userJWT = request.user;

    const data =
      bodyValidation<UserUpdateInputDTO>(UserUpdateBodySchema)(request);

    if (!data.email && !data.name) {
      throw new BadRequestError(
        "No data send",
        {},
        userControllerErrorCodes.E_0_CTR_USR_0002.code
      );
    }

    const updatedUser = await this.service.update(userJWT, data);

    const output: AuthenticatedHttpResponse<UserUpdateOutputDTO> = {
      statusCode: 200,
      body: updatedUser,
    };

    return output;
  }
}

export { UserUpdateController };
