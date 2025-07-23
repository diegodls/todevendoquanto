import {
  DeleteUserInputDTO,
  DeleteUserOutputDTO,
} from "../../../core/domain/User";
import { HttpRequest, HttpResponse } from "../../../types/HttpRequestResponse";

interface IDeleteUserController {
  handle(
    request: HttpRequest<DeleteUserInputDTO>
  ): Promise<HttpResponse<DeleteUserOutputDTO>>;
}

export { IDeleteUserController };
