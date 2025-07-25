import { TypedError } from '@/core/ports/infrastructure/middlewares/IErrorsHandler';
import { errorHandler } from "@/infrastructure/middlewares/ErrorsHandler";

import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

const errorHandlerAdapterExpress: ErrorRequestHandler = (
  error: TypedError,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  const { message, status, errors, code, timestamp } = errorHandler(error);

  response.status(status).json({ message, errors, code, timestamp });
};

export { errorHandlerAdapterExpress };
