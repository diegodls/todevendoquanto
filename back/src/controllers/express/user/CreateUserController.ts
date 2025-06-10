import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "../../../entities/User";
import { UserService } from "../../../services/user/userService";
import { HttpRequest, HttpResponse } from "../../../types/HttpRequestResponse";
import { InternalError } from "../../../utils/errors/ApiError";
import { userErroCodes } from "../../../utils/errors/codes/user/userErrorCodes";
import { ICreateUserController } from "../../interfaces/user/ICreateUserController";

export class UserController implements ICreateUserController {
  constructor(private readonly service: UserService) {}

  public async handle(
    request: HttpRequest<CreateUserInputDTO>
  ): Promise<HttpResponse<CreateUserOutputDTO>> {
    const createdUser = await this.service.create(request.body);

    if (!createdUser) {
      throw new InternalError(
        "Internal Server Error",
        {},
        userErroCodes.E_0_CTR_USR_0001.code
      );
    }

    const { password, ...userOutput } = createdUser;

    console.log("");
    console.log(userOutput);

    const output: HttpResponse<CreateUserOutputDTO> = {
      statusCode: 200,
      body: userOutput,
    };

    return output;
  }
}
