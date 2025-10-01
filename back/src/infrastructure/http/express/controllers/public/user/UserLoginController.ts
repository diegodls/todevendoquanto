import {
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "@/application/dtos/user/UserLoginDTO";
import { UserService } from "@/application/services/user/userService";
import {
  PublicHttpRequest,
  PublicHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { IUserLoginController } from "@/core/usecases/public/user/IUserLoginController";
import { requestValidation } from "@/infrastructure/validation/zod/RequestValidation";
import { UserLoginBodySchema } from "@/infrastructure/validation/zod/schemas/user/UserLoginBodySchema";

class UserLoginController implements IUserLoginController {
  constructor(private readonly service: UserService) {}

  public async handle(
    request: PublicHttpRequest<UserLoginInputDTO>
  ): Promise<PublicHttpResponse<UserLoginOutputDTO> | null> {
    const data = requestValidation<UserLoginInputDTO>(UserLoginBodySchema)(
      request,
      "body"
    );

    const token = await this.service.login(data);

    const output: PublicHttpResponse<UserLoginOutputDTO> = {
      statusCode: 200,
      body: token,
    };

    return output;
  }
}

export { UserLoginController };
