import { IJwtPayload } from "@/core/ports/infrastructure/auth/IJWTAuth";
import {
  AuthenticatedHttpRequest,
  AuthenticatedHttpResponse,
  PublicHttpRequest,
  PublicHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";
import { adminUserFromToken } from "@/infrastructure/auth/adminUserFromToken";

import { Request, Response } from "express";

// TODO: Se quiser juntar tudo em um adapter, dá para receber a prop isAuth: boolean junto ao controller e fazer a lógica referente ao isAuth.

const publicHttpAdapterExpress = (controller: any) => {
  //TODO: abstrair o "Controller" para um genérico (com o método handler) e trocar esse "any"
  return async (request: Request, response: Response) => {
    const httpRequest: PublicHttpRequest = {
      body: request.body,
      headers: request.headers,
      params: request.params,
      query: request.query,
    };

    const httpResponse: PublicHttpResponse = await controller.handle(
      httpRequest
    );

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};

type IAuthenticatedHttpAdapterExpress = <B, H, P, Q, R>(
  controller: IAuthenticatedController<B, H, P, Q, R>
) => (request: Request, response: Response) => Promise<void>;

const authenticatedHttpAdapterExpress = <B, H, P, Q, R>(
  controller: IAuthenticatedController<B, H, P, Q, R>
) => {
  return async (request: Request, response: Response) => {
    const adminUser: IJwtPayload = await adminUserFromToken(request);

    const authenticatedHttpRequest: AuthenticatedHttpRequest = {
      body: request.body as B,
      headers: request.headers as H,
      params: request.params as P,
      query: request.query as Q,
      user: adminUser,
    };

    const httpResponse: AuthenticatedHttpResponse<R> = await controller.handle(
      authenticatedHttpRequest
    );

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};

export {
  authenticatedHttpAdapterExpress,
  IAuthenticatedHttpAdapterExpress,
  publicHttpAdapterExpress,
};
