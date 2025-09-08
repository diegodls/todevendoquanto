import {
  UserSignInInputDTO,
  UserSignInOutputDTO,
} from "@/application/dtos/UserSignInDTO";
import { UserService } from "@/application/services/user/userService";
import {
  PublicHttpRequest,
  PublicHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { InternalError } from "@/core/shared/utils/errors/ApiError";
import { userControllerErrorCodes } from "@/core/shared/utils/errors/codes/user/userErrorCodes";
import { IUserSignInController } from "@/core/usecases/user/IUserSignInController";
import { bodyValidation } from "@/infrastructure/validation/zod/BodyValidation";
import { UserSignInBodySchema } from "@/infrastructure/validation/zod/schemas/user/UserSignInBodySchema";

export class UserSignInController implements IUserSignInController {
  constructor(private readonly service: UserService) {}

  public async handle(
    request: PublicHttpRequest<UserSignInInputDTO>
  ): Promise<PublicHttpResponse<UserSignInOutputDTO>> {
    const data =
      bodyValidation<UserSignInInputDTO>(UserSignInBodySchema)(request);

    const createdUser = await this.service.create(data);

    if (!createdUser) {
      throw new InternalError(
        "Internal Server Error",
        {},
        userControllerErrorCodes.E_0_CTR_USR_0001.code
      );
    }

    const { password, ...userOutput } = createdUser;

    const output: PublicHttpResponse<UserSignInOutputDTO> = {
      statusCode: 200,
      body: userOutput,
    };

    return output;
  }
}
