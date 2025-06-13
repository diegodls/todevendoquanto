import { UserLoginInputDTO, UserLoginOutputDTO } from "../../../entities/User";
import { UserService } from "../../../services/user/userService";
import { HttpRequest, HttpResponse } from "../../../types/HttpRequestResponse";
import { bodyValidation } from "../../../validation/zod/BodyValidation";
import { UserLoginBodySchema } from "../../../validation/zod/schemas/user/UserLoginBodySchema";
import { IUserLoginController } from "../../interfaces/user/IUserLoginController";

class UserLoginController implements IUserLoginController {
  constructor(private readonly service: UserService) {}

  public async handle(
    request: HttpRequest<UserLoginInputDTO>
  ): Promise<HttpResponse<UserLoginOutputDTO> | null> {
    const data =
      bodyValidation<UserLoginInputDTO>(UserLoginBodySchema)(request);

    const token = await this.service.login(data);

    const output: HttpResponse<UserLoginOutputDTO> = {
      statusCode: 200,
      body: token,
    };

    return output;
  }
}

export { UserLoginController };
