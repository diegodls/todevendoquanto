import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { errorHandler } from "../../middlewares/ErrorsHandler";
import { TypedError } from "../../middlewares/IErrorsHandler";

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
