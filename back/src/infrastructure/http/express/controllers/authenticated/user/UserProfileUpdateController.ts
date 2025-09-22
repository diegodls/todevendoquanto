import { UserProfileUpdateInputDTO } from "@/application/dtos/UserProfileUpdateDTO";
import { AuthenticatedHttpRequest } from "@/core/shared/types/HttpRequestResponse";
import { IUserProfileUpdateController } from "@/core/usecases/admin/user/IUserProfileUpdateController";
import { bodyValidation } from "@/infrastructure/validation/zod/BodyValidation";
import { UserProfileUpdateBodySchema } from "@/infrastructure/validation/zod/schemas/user/UserProfileUpdateBodySchema";

class UserProfileUpdateController implements IUserProfileUpdateController {
  public async handle(
    request: AuthenticatedHttpRequest<UserProfileUpdateInputDTO>
  ) {
    const user = request.user;

    const body = bodyValidation<UserProfileUpdateInputDTO>(
      UserProfileUpdateBodySchema
    )(request);

    console.log("");
    console.log("user:");
    console.log(user);
    console.log("");
    console.log("body:");
    console.log(body);
    console.log("");

    const output = { statusCode: 200, body: {} };

    return output;
  }
}

export { UserProfileUpdateController };
