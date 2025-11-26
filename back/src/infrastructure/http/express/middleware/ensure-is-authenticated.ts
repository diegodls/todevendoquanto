import { JwtVerifyTokenInterface } from "@/core/ports/infrastructure/auth/jwt-verify-token-interface";
import { UnauthorizedError } from "@/core/shared/errors/api-errors";
import { AuthenticatedHttpRequestInterface } from "@/core/shared/types/http-request-response";
import { ensureIsAuthenticatedErrors } from "@/infrastructure/errors/codes/middlewares/ensure-is-authenticated-errors";
import { NextFunction, Request, Response } from "express";

export const ensureIsAuthenticated = (jwtAuth: JwtVerifyTokenInterface) => {
  return async (request: Request, _response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Authorization token wasn't send!",
        {},
        ensureIsAuthenticatedErrors.E_0_MDW_AUTH_0001.code
      );
    }

    const token = authHeader.split(" ")[1];

    // TODO: verificar o expiration date

    const decoded = await jwtAuth.execute<JwtPayloadInterface>(token);

    (request as unknown as AuthenticatedHttpRequestInterface).user = decoded;

    next();
  };
};
