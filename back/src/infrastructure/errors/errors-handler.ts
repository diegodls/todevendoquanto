import { ApiError } from "@/core/shared/errors/api-errors";
import {
  ErrorHandlerType,
  ErrorType,
} from "@/core/shared/errors/types/errors-handler-type";
import { errorHandlerErrorCodes } from "@/infrastructure/errors/codes/error-handler-errors";

import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";

export const errorHandler: ErrorHandlerType = (error: ErrorType) => {
  const status = error.statusCode ?? 500;
  let message = error.message ?? "Internal Server Error";
  const errors = error.errors;
  let code = error.appCode;

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
    code = errorHandlerErrorCodes.E_0_HAN_JWT_0001.code;
  }

  if (error instanceof JsonWebTokenError) {
    message = "Internal Server Error";
    code = errorHandlerErrorCodes.E_0_HAN_JWT_0002.code;
  }

  if (error instanceof NotBeforeError) {
    message = "Internal Server Error";
    code = errorHandlerErrorCodes.E_0_HAN_JWT_0003.code;
  }

  const returnError = new ApiError(message, status, errors, code, timestamp);

  return returnError;
};
