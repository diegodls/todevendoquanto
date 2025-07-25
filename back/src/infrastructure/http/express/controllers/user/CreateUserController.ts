import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "@/application/dtos/CreateUserDTO";
import { UserService } from "@/application/services/user/userService";
import {
  HttpRequest,
  HttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { InternalError } from "@/core/shared/utils/errors/ApiError";
import { userControllerErrorCodes } from "@/core/shared/utils/errors/codes/user/userErrorCodes";
import { ICreateUserController } from "@/core/usecases/user/ICreateUserController";
import { bodyValidation } from "@/infrastructure/validation/zod/BodyValidation";
import { CreateUserBodySchema } from "@/infrastructure/validation/zod/schemas/user/CreateUserBodySchema";

export class CreateUserController implements ICreateUserController {
  constructor(private readonly service: UserService) {}

  public async handle(
    request: HttpRequest<CreateUserInputDTO>
  ): Promise<HttpResponse<CreateUserOutputDTO>> {
    const data =
      bodyValidation<CreateUserInputDTO>(CreateUserBodySchema)(request);

    const createdUser = await this.service.create(data);

    if (!createdUser) {
      throw new InternalError(
        "Internal Server Error",
        {},
        userControllerErrorCodes.E_0_CTR_USR_0001.code
      );
    }

    const { password, ...userOutput } = createdUser;

    const output: HttpResponse<CreateUserOutputDTO> = {
      statusCode: 200,
      body: userOutput,
    };

    return output;
  }
}
