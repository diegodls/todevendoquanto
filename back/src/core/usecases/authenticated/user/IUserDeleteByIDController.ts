import {
  UserDeleteByIDInputDTO,
  UserDeleteByIDOutputDTO,
} from "@/application/dtos/user/UserDeleteDTO";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";
/*
interface IUserDeleteByIDController {
  handle(
    request: AuthenticatedHttpRequest<UserDeleteByIDInputDTO>
  ): Promise<HttpResponse<UserDeleteByIDOutputDTO>>;
}
*/
type IUserDeleteByIDController = IAuthenticatedController<
  UserDeleteByIDInputDTO,
  {},
  {},
  {},
  UserDeleteByIDOutputDTO
>;

export { IUserDeleteByIDController };
