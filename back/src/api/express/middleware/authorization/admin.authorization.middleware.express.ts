import e, { NextFunction, Request, Response } from "express";
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

  const idDecoded = jwt.verify(token, jwt_pass, (err, decoded) => {
    if (err) {
      throw new CustomApiErrors.UnauthorizedError(
        "Internal Server Error!",
        {},
        AdminMiddlewareErrorsCodes.E_0_MW_ADM_0003.code
      );
    }

    parei aqui, colocar o id fora da função, remover o idDecorede e tratar como função o jwt.verify
    atribuir aqui o id

    const { id } = decoded as CreateUserAuth;

    console.log("🔴🔴🔴🔴🔴");
    console.log("");
    console.log("err:");
    console.log(err);
    console.log("🟢🟢🟢🟢🟢");
    console.log("");
    console.log("decoded:");
    console.log(decoded);
    console.log("🟢🟢🟢🟢🟢");
    console.log("");
    console.log("id:");
    console.log(id);

    return id;
  });

  console.log("");
  console.log("🔵🔵🔵🔵🔵");
  console.log("ID");
  console.log(idDecoded);

  throw new CustomApiErrors.UnauthorizedError(
    "AAAAAAAAAAAAAAAAAA",
    {},
    AdminMiddlewareErrorsCodes.E_0_MW_ADM_0002.code
  );

  /*
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
  */
};
