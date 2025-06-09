import { ApiError } from "../utils/ApiError";
import { ErrorTyped, TErrorHandler } from "./IErrorsHandler";

const errorHandler: TErrorHandler = (error: ErrorTyped) => {
  const status = error.status ?? 500;
  let message = error.message ?? "Internal Server Error";
  const errors = error.errors ?? [];
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

  //! TODO: JSONWEBTOKEN

  const returnError = new ApiError(message, status, errors, code, timestamp);

  return returnError;
};

export { errorHandler };
