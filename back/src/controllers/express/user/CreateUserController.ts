import { CreateUserDTO } from "../../../entities/User";
import { UserService } from "../../../services/userService";
import { HttpRequest, HttpResponse } from "../../../types/HttpRequestResponse";
import { ICreateUserController } from "../../ICreateUserController";

export class UserController implements ICreateUserController {
  constructor(private readonly service: UserService) {}

  public async handle(
    request: HttpRequest<CreateUserDTO>
  ): Promise<HttpResponse> {
    const createdUser = await this.service.create(request.body);

    if (!createdUser) {
      return { body: { message: "ERRO" }, statusCode: 400 };
    }

    return { body: { createdUser }, statusCode: 201 };
  }
}
