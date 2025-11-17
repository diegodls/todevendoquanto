import {
  SignInUserInputDTO,
  SignInUserOutputDTO,
} from "@/application/dtos/user/sign-in-dto";
import { UserSignInControllerInterface } from "@/core/ports/infrastructure/http/controllers/public/user/user-sign-in-controller-interface";
import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import { InternalError } from "@/core/shared/utils/errors/api-error";
import { userControllerErrorCodes } from "@/core/shared/utils/errors/codes/user/user-error-codes";
import { UpdateUserUseCase } from "@/core/usecases/user/update-user-usecase";
import { UserSignInBodySchema } from "@/infrastructure/validation/zod/schemas/user/user-sign-in-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/shared/validation/request-validation";

export class UserSignInController implements UserSignInControllerInterface {
  constructor(private readonly service: UpdateUserUseCase) {}

  public async handle(
    request: PublicHttpRequestInterface<SignInUserInputDTO>
  ): Promise<PublicHttpResponseInterface<SignInUserOutputDTO>> {
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

    const output: PublicHttpResponseInterface<SignInUserOutputDTO> = {
      statusCode: 200,
      body: userOutput,
    };

    return output;
  }
}
