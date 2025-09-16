import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDOutputDTO,
} from "@/application/dtos/DeleteUserDTO";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";
/*
interface IDeleteUserByIDController {
  handle(
    request: AuthenticatedHttpRequest<DeleteUserByIDInputDTO>
  ): Promise<HttpResponse<DeleteUserByIDOutputDTO>>;
}
*/
type IDeleteUserByIDController = IAuthenticatedController<
  DeleteUserByIDInputDTO,
  {},
  {},
  {},
  DeleteUserByIDOutputDTO
>;

export { IDeleteUserByIDController };
