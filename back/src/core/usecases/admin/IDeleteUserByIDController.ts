import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDOutputDTO,
} from "@/application/dtos/DeleteUserDTO";
import {
  AuthenticatedHttpRequest,
  HttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

interface IDeleteUserByIDController {
  handle(
    request: AuthenticatedHttpRequest<DeleteUserByIDInputDTO>
  ): Promise<HttpResponse<DeleteUserByIDOutputDTO>>;
}

export { IDeleteUserByIDController };
