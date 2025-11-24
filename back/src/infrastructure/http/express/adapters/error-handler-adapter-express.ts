import { ErrorType } from "@/core/shared/errors/types/errors-handler-type";
import { errorHandler } from "@/infrastructure/errors/errors-handler";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const errorHandlerAdapterExpress: ErrorRequestHandler = (
  error: ErrorType,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  const { message, statusCode, errors, appCode, timestamp } =
    errorHandler(error);

  response.status(statusCode).json({ message, errors, appCode, timestamp });
};
