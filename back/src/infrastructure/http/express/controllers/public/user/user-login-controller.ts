import {
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "@/application/dtos/user/user-login-dto";
import { UserService } from "@/application/services/user-service";
import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import { UserLoginControllerInterface } from "@/core/usecases/public/user/user-login-controller-interface";
import { UserLoginBodySchema } from "@/infrastructure/validation/zod/schemas/user/user-login-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/shared/validation/request-validation";

export class UserLoginController implements UserLoginControllerInterface {
  constructor(private readonly service: UserService) {}

  public async handle(
    request: PublicHttpRequestInterface<UserLoginInputDTO>
  ): Promise<PublicHttpResponseInterface<UserLoginOutputDTO> | null> {
    const input = requestValidation("body", request, UserLoginBodySchema);

    const token = await this.service.login(input);

    const output: PublicHttpResponseInterface<UserLoginOutputDTO> = {
      statusCode: 200,
      body: token,
    };

    return output;
  }
}
