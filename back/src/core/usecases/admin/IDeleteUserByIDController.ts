import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDOutputDTO,
} from "@/application/dtos/DeleteUserDTO";
import {
  HttpRequest,
  HttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

interface IDeleteUserByIDController {
  handle(
    request: HttpRequest<DeleteUserByIDInputDTO>
  ): Promise<HttpResponse<DeleteUserByIDOutputDTO>>;
}

export { IDeleteUserByIDController };
