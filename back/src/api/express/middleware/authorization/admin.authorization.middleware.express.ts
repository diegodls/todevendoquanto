import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomApiErrors } from "../../../../util/api.errors";
import { AdminMiddlewareErrorsCodes } from "../../../../util/errors-codes/middleware.errors.codes/admin.authorization";
import { CreateUserAuth } from "../../../../util/validations/zod/admin/admin.create-user.zod.validation";
import { CreateUserRequestBody } from "../../controllers/admin/admin.controller.interface";

export interface AuthRequest extends CreateUserRequestBody {
  user: CreateUserAuth;
}

export const AdminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new CustomApiErrors.UnauthorizedError(
      "Unauthorized",
      {},
      AdminMiddlewareErrorsCodes.E_0_MW_ADM_0002.code
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new CustomApiErrors.UnauthorizedError(
      "Unauthorized",
      {},
      AdminMiddlewareErrorsCodes.E_0_MW_ADM_0004.code
    );
  }

  const jwt_pass = process.env.JWT_PASS;

  if (!jwt_pass) {
    throw new CustomApiErrors.InternalError(
      "Internal Server Error!",
      {},
      AdminMiddlewareErrorsCodes.E_0_MW_ADM_0001.code
    );
  }

  const decoded = jwt.verify(token, jwt_pass) as CreateUserAuth;

  if (!decoded?.id) {
    throw new CustomApiErrors.InternalError(
      "Internal Server Error!",
      {},
      AdminMiddlewareErrorsCodes.E_0_MW_ADM_0003.code
    );
  }

  (req as AuthRequest).user = decoded;

  next();
};
