import {
  DeleteUserInputDTO,
  DeleteUserOutputDTO,
} from "@/application/dtos/DeleteUserDTO";
import {
  HttpRequest,
  HttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

interface IDeleteUserController {
  handle(
    request: HttpRequest<DeleteUserInputDTO>
  ): Promise<HttpResponse<DeleteUserOutputDTO>>;
}

export { IDeleteUserController };
