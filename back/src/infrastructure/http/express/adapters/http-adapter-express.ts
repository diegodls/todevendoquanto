import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";
import { PublicControllerInterface } from "@/core/ports/infrastructure/http/controllers/public-controller-interface";
import { UnauthorizedError } from "@/core/shared/errors/api-errors";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import { jwtAuthErrorCodes } from "@/infrastructure/errors/codes/auth/jwt-errors";

import { Request, Response } from "express";

// TODO: Se quiser juntar tudo em um adapter, dá para receber a prop isAuth: boolean junto ao controller e fazer a lógica referente ao isAuth.

export type AuthenticatedHttpAdapterExpressType = <B, H, P, Q, R>(
  controller: AuthenticatedControllerInterface<B, H, P, Q, R>
) => (request: Request, response: Response) => Promise<void>;

export const authenticatedExpressHttpAdapter = <B, H, P, Q, R>(
  controller: AuthenticatedControllerInterface<B, H, P, Q, R>
) => {
  return async (request: Request, response: Response) => {
    if (!request.user) {
      throw new UnauthorizedError(
        "Not authorized",
        {},
        jwtAuthErrorCodes.E_0_MW_JWT_0001.code
      );
    }
    const authenticatedHttpRequest: AuthenticatedHttpRequestInterface = {
      body: request.body as B,
      headers: request.headers as H,
      params: request.params as P,
      query: request.query as Q,
      user: request.user,
    };

    const httpResponse: AuthenticatedHttpResponseInterface<R> =
      await controller.handle(authenticatedHttpRequest);

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};

export const publicExpressHttpAdapter = <B, H, P, Q, R>(
  controller: PublicControllerInterface<B, H, P, Q, R>
) => {
  return async (request: Request, response: Response) => {
    const httpRequest: PublicHttpRequestInterface = {
      body: request.body as B,
      headers: request.headers as H,
      params: request.params as P,
      query: request.query as Q,
    };

    const httpResponse: PublicHttpResponseInterface<R> =
      await controller.handle(httpRequest);

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
