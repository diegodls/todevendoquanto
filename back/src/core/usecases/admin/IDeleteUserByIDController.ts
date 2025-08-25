import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDOutputDTO,
} from "@/application/dtos/DeleteUserDTO";
import {
  AuthenticatedHttpRequest,
  HttpResponse,
} from "@/core/shared/types/HttpRequestResponse";

interface Controller<B = any, H = any, P = any, Q = any, R = any> {
  handle: (
    request: AuthenticatedHttpRequest<B, H, P, Q>
  ) => Promise<HttpResponse<R>>;
}

interface IDeleteUserByIDController {
  handle(
    request: AuthenticatedHttpRequest<DeleteUserByIDInputDTO>
  ): Promise<HttpResponse<DeleteUserByIDOutputDTO>>;
}

export { Controller, IDeleteUserByIDController };
