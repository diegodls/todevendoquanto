import { ErrorType } from "@/core/ports/infrastructure/errors/errors-handler-type";
import { errorHandler } from "@/infrastructure/errors/errors-handler";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const errorHandlerAdapterExpress: ErrorRequestHandler = (
  error: ErrorType,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  const { message, status, errors, code, timestamp } = errorHandler(error);

  response.status(status).json({ message, errors, code, timestamp });
};
