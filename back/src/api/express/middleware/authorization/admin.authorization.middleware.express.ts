import { NextFunction, Request, Response } from "express";
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
  console.log("AAAAAAAAAAA");
  next();
  /*
  const { authorization } = req.headers;

  if (!authorization) {
    throw new CustomApiErrors.UnauthorizedError("Unauthorized!");
  }
  const token = authorization.split("")[1];

  const jwt_pass = process.env.JWT_PASS;

  if (!jwt_pass) {
    throw new CustomApiErrors.InternalError("Internal Server Error!");
  }

  const { id, name } = jwt.verify(token, jwt_pass) as CreateUserAuth;

  if (!id || !name) {
    throw new CustomApiErrors.InternalError("Internal Server Error!");
  }

  const verifiedUser: CreateUserAuth = { id, name };

  (req as AuthRequest).user = verifiedUser;

  next();*/
};
