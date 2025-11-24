import { UnauthorizedError } from "@/core/shared/errors/api-errors";
import { ensureIsAdminErrors } from "@/infrastructure/errors/codes/middlewares/ensure-is-admin-errors";
import { NextFunction, Request, Response } from "express";

export const ensureIsAdmin = () => {
  return async (request: Request, _response: Response, next: NextFunction) => {
    const user = request.user;

    if (user?.role !== "ADMIN") {
      throw new UnauthorizedError(
        "Not authorized",
        {},
        ensureIsAdminErrors.E_0_MDW_ADM_0001.code
      );
    }

    next();
  };
};
