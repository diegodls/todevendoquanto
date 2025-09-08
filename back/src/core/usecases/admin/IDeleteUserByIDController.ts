import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDOutputDTO,
} from "@/application/dtos/DeleteUserDTO";
import { AuthenticatedController } from "@/core/usecases/AuthenticatedController";
/*
interface IDeleteUserByIDController {
  handle(
    request: AuthenticatedHttpRequest<DeleteUserByIDInputDTO>
  ): Promise<HttpResponse<DeleteUserByIDOutputDTO>>;
}
*/
type IDeleteUserByIDController = AuthenticatedController<
  DeleteUserByIDInputDTO,
  {},
  {},
  {},
  DeleteUserByIDOutputDTO
>;

export { IDeleteUserByIDController };
