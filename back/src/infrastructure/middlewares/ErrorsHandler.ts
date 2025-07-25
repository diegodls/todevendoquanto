import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";

import { ApiError } from "@/core/shared/utils/errors/ApiError";
import { MiddlewareErrorHandler } from "@/core/shared/utils/errors/codes/middleware/middlewareErrorHandler";
import {
  TErrorHandler,
  TypedError,
} from "@/core/ports/infrastructure/middlewares/IErrorsHandler";

const errorHandler: TErrorHandler = (error: TypedError) => {
  const status = error.status ?? 500;
  let message = error.message ?? "Internal Server Error";
  const errors = error.errors;
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

  //! JSONWEBTOKEN

  if (error instanceof TokenExpiredError) {
    message = "Internal Server Error";
    code = MiddlewareErrorHandler.E_0_MW_ADM_0001.code;
  }

  if (error instanceof JsonWebTokenError) {
    message = "Internal Server Error";
    code = MiddlewareErrorHandler.E_0_MW_ADM_0002.code;
  }

  if (error instanceof NotBeforeError) {
    message = "Internal Server Error";
    code = MiddlewareErrorHandler.E_0_MW_ADM_0003.code;
  }

  const returnError = new ApiError(message, status, errors, code, timestamp);

  return returnError;
};

export { errorHandler };
