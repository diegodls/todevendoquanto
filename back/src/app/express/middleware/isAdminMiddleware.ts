import { NextFunction, Request, Response } from "express";
import { AuthService, IUserLoginDecode } from "../../../core/ports/auth";
import { UnauthorizedError } from "../../../utils/errors/ApiError";
import { adminControllerErrorCodes } from "../../../utils/errors/codes/admin/adminErrorCodes";

interface AuthenticatedRequest extends Request {
  user: IUserLoginDecode;
}

const isAdminMiddleware = (authService: AuthService) => {
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

    const decoded = await authService.verifyToken(token);

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
