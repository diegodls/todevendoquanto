import { DeleteUserByIDInputDTO } from "@/application/dtos/DeleteUserDTO";
import {
  AuthenticatedHttpRequest,
  HttpRequest,
  HttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { adminUserFromToken } from "@/infrastructure/auth/adminUserFromToken";

import { Request, Response } from "express";

const publicHttpAdapterExpress = (controller: any) => {
  //TODO: abstrair o "Controller" para um genérico (com o método handler) e trocar esse "any"
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body,
      headers: request.headers,
      params: request.params,
      query: request.query,
    };

    const httpResponse: HttpResponse = await controller.handle(httpRequest);

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};

const authenticatedHttpAdapterExpress = (controller: any) => {
  return async (request: Request, response: Response) => {
    const adminUser = await adminUserFromToken(request);

    const authenticatedHttpRequest: AuthenticatedHttpRequest = {
      body: request.body,
      headers: request.headers,
      params: request.params,
      query: request.query,
      user: adminUser,
    };

    const httpResponse: HttpResponse<DeleteUserByIDInputDTO> =
      await controller.handle(authenticatedHttpRequest);

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};

export { authenticatedHttpAdapterExpress, publicHttpAdapterExpress };
