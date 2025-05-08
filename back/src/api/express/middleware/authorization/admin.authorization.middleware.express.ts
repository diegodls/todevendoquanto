import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomApiErrors } from "../../../../util/api.errors";
import { AdminMiddlewareErrorsCodes } from "../../../../util/errors-codes/middleware.errors.codes/admin.authorization";
import { CreateUserAuth } from "../../../../util/validations/zod/admin/admin.create-user.zod.validation";
import { CreateUserRequestBody } from "../../controllers/admin/admin.controller.interface";

export interface AuthRequest extends CreateUserRequestBody {
  user: CreateUserAuth;
}

export const authAdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new CustomApiErrors.UnauthorizedError(
      "Unauthorized",
      {},
      AdminMiddlewareErrorsCodes.E_0_MW_ADM_0002.code
    );
  }
  const token = authorization.split(" ")[1];

  const jwt_pass = process.env.JWT_PASS;

  if (!jwt_pass) {
    throw new CustomApiErrors.InternalError(
      "Internal Server Error!",
      {},
      AdminMiddlewareErrorsCodes.E_0_MW_ADM_0001.code
    );
  }

  const { id } = jwt.verify(token, jwt_pass) as CreateUserAuth;

  console.log("");
  console.log("");
  console.log(jwt.verify(token, jwt_pass));

  if (!id) {
    throw new CustomApiErrors.InternalError(
      "Internal Server Error!",
      {},
      AdminMiddlewareErrorsCodes.E_0_MW_ADM_0003.code
    );
  }

  const verifiedUser: CreateUserAuth = { id };

  (req as AuthRequest).user = verifiedUser;

  next();
};
