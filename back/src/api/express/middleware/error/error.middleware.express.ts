import { NextFunction, Request, Response } from "express";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { ApiError } from "../../../../util/api.errors";
import { AdminMiddlewareErrorsCodes } from "../../../../util/errors-codes/middleware.errors.codes/admin.authorization";

export function errorMiddlewareExpress(
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status ?? 500;

  let message = error.message ?? "Internal Server Error";

  const errors = error.errors || [];

  let code = error.code;

  const timestamp = new Date().toLocaleString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  if (error instanceof TokenExpiredError) {
    message = "Internal Server Error";
    code = AdminMiddlewareErrorsCodes.E_0_MW_ADM_0005.code;
  }

  if (error instanceof JsonWebTokenError) {
    message = "Internal Server Error";
    code = AdminMiddlewareErrorsCodes.E_0_MW_ADM_0006.code;
  }

  if (error instanceof NotBeforeError) {
    message = "Internal Server Error";
    code = AdminMiddlewareErrorsCodes.E_0_MW_ADM_0007.code;
  }

  res.status(status).json({ message, errors, code, timestamp });
}
