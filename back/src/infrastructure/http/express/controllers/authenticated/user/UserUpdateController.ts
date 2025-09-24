import { UserUpdateInputDTO } from "@/application/dtos/user/UserUpdateDTO";
import { AuthenticatedHttpRequest } from "@/core/shared/types/HttpRequestResponse";
import { IUserUpdateController } from "@/core/usecases/authenticated/user/IUserUpdateController";

import { bodyValidation } from "@/infrastructure/validation/zod/BodyValidation";
import { UserUpdateBodySchema } from "@/infrastructure/validation/zod/schemas/user/UserProfileUpdateBodySchema";

class UserUpdateController implements IUserUpdateController {
  public async handle(request: AuthenticatedHttpRequest<UserUpdateInputDTO>) {
    const user = request.user;

    const body =
      bodyValidation<UserUpdateInputDTO>(UserUpdateBodySchema)(request);

    console.log("");
    console.log("user:");
    console.log(user);
    console.log("");
    console.log("body:");
    console.log(body);
    console.log("");

    //PAREI AQUI, TEM QUE FAZER O testServiceErrorCodes, REPOSITORY, RENOMEAR ALGUMAS PASTAS PARA READEQUAR AO: PUBLIC | AUTHENTICATED

    const output = { statusCode: 200, body: {} };

    return output;
  }
}

export { UserUpdateController };
