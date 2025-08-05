import {
  IJWTAuth,
  IUserLoginDecode,
} from "@/core/ports/infrastructure/auth/IJWTAuth";
import { UnauthorizedError } from "@/core/shared/utils/errors/ApiError";
import { adminControllerErrorCodes } from "@/core/shared/utils/errors/codes/admin/adminErrorCodes";
import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user: IUserLoginDecode; // TODO: trocar esse nome para IUserLogged, ver se pode/melhora antes
}

const IsAdminMiddleware = (jWTAuth: IJWTAuth) => {
  return async (request: Request, _response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Not authorized",
        {},
        adminControllerErrorCodes.E_0_CTR_ADM_0001.code
      );
    }

    const token = authHeader.split(" ")[1];

    //const [bearer, token] = authHeader.split(" ");

    const decoded = await jWTAuth.verifyToken(token);

    if (decoded?.role !== "ADMIN") {
      throw new UnauthorizedError(
        "Not authorized",
        {},
        adminControllerErrorCodes.E_0_CTR_ADM_0001.code
      );
    }

    //request.user = decoded;
    // ! PAREI AQUI, TEM QUE TROCAR O TIPO DO "request" PARA ACEITAR O ".user" (AuthenticatedRequest)
    // Tentar trocar o tipo do

    next();
  };
};

export { IsAdminMiddleware };
