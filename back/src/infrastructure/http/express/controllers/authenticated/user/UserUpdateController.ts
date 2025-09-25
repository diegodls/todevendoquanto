import {
  UserUpdateInputDTO,
  UserUpdateOutputDTO,
} from "@/application/dtos/user/UserUpdateDTO";
import { IUserService } from "@/application/services/user/IUserService";
import {
  AuthenticatedHttpRequest,
  AuthenticatedHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { IUserUpdateController } from "@/core/usecases/authenticated/user/IUserUpdateController";

import { bodyValidation } from "@/infrastructure/validation/zod/BodyValidation";
import { UserUpdateBodySchema } from "@/infrastructure/validation/zod/schemas/user/UserProfileUpdateBodySchema";

class UserUpdateController implements IUserUpdateController {
  constructor(readonly service: IUserService) {}

  public async handle(
    request: AuthenticatedHttpRequest<UserUpdateInputDTO>
  ): Promise<AuthenticatedHttpResponse<UserUpdateOutputDTO>> {
    const userJWT = request.user;

    const body =
      bodyValidation<UserUpdateInputDTO>(UserUpdateBodySchema)(request);

    console.log("");
    console.log("userJWT:");
    console.log(userJWT);
    console.log("");
    console.log("body:");
    console.log(body);
    console.log("");

    const updatedUser = this.service.update(body, userJWT);

    //PAREI AQUI, TEM QUE FAZER O testServiceErrorCodes, REPOSITORY, RENOMEAR ALGUMAS PASTAS PARA READEQUAR AO: PUBLIC | AUTHENTICATED

    const output: AuthenticatedHttpResponse<UserUpdateOutputDTO> = {
      statusCode: 200,
      body: updatedUser,
    };

    return output;
  }
}

export { UserUpdateController };
