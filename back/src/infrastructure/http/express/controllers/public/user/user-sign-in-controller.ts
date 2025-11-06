import {
  UserSignInInputDTO,
  UserSignInOutputDTO,
} from "@/application/dtos/user/user-sign-in-dto";
import { UserService } from "@/application/services/user-service";
import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import { InternalError } from "@/core/shared/utils/errors/api-error";
import { userControllerErrorCodes } from "@/core/shared/utils/errors/codes/user/user-error-codes";
import { UserSignInControllerInterface } from "@/core/usecases/public/user/user-sign-in-controller-interface";
import { UserSignInBodySchema } from "@/infrastructure/validation/zod/schemas/user/user-sign-in-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/shared/validation/request-validation";

export class UserSignInController implements UserSignInControllerInterface {
  constructor(private readonly service: UserService) {}

  public async handle(
    request: PublicHttpRequestInterface<UserSignInInputDTO>
  ): Promise<PublicHttpResponseInterface<UserSignInOutputDTO>> {
    const input = requestValidation("body", request, UserSignInBodySchema);

    const createdUser = await this.service.create(input);

    if (!createdUser) {
      throw new InternalError(
        "Internal Server Error",
        {},
        userControllerErrorCodes.E_0_CTR_USR_0001.code
      );
    }

    const { password, ...userOutput } = createdUser;

    const output: PublicHttpResponseInterface<UserSignInOutputDTO> = {
      statusCode: 200,
      body: userOutput,
    };

    return output;
  }
}
