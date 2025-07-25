import {
  IUserLoginDecode,
  JWTAuth,
} from "@/core/ports/infrastructure/middlewares/JWTAuth";
import { UnauthorizedError } from "@/core/shared/utils/errors/ApiError";
import { adminControllerErrorCodes } from "@/core/shared/utils/errors/codes/admin/adminErrorCodes";
import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user: IUserLoginDecode;
}

const isAdminMiddleware = (jWTAuth: JWTAuth) => {
  return async (
    request: AuthenticatedRequest,
    _response: Response,
    next: NextFunction
  ) => {
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

    request.user = decoded;

    next();
  };
};

export { isAdminMiddleware };
