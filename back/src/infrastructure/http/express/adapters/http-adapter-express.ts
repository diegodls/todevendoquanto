import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

import { Request, Response } from "express";

// TODO: Se quiser juntar tudo em um adapter, dá para receber a prop isAuth: boolean junto ao controller e fazer a lógica referente ao isAuth.

export const publicHttpAdapterExpress = (controller: any) => {
  //TODO: abstrair o "Controller" para um genérico (com o método handler) e trocar esse "any"
  return async (request: Request, response: Response) => {
    const httpRequest: PublicHttpRequestInterface = {
      body: request.body,
      headers: request.headers,
      params: request.params,
      query: request.query,
    };

    const httpResponse: PublicHttpResponseInterface = await controller.handle(
      httpRequest
    );

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};

export type AuthenticatedHttpAdapterExpressType = <B, H, P, Q, R>(
  controller: AuthenticatedControllerInterface<B, H, P, Q, R>
) => (request: Request, response: Response) => Promise<void>;

export const authenticatedHttpAdapterExpress = <B, H, P, Q, R>(
  controller: AuthenticatedControllerInterface<B, H, P, Q, R>
) => {
  return async (request: Request, response: Response) => {
    const authenticatedHttpRequest: AuthenticatedHttpRequestInterface = {
      body: request.body as B,
      headers: request.headers as H,
      params: request.params as P,
      query: request.query as Q,
      user: request.user!, // TODO: remover o user daqui, provavelmente quando trocar o authenticated...
    };

    const httpResponse: AuthenticatedHttpResponseInterface<R> =
      await controller.handle(authenticatedHttpRequest);

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
