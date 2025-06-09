import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../../middlewares/ErrorsHandler";
import { ErrorTyped } from "../../middlewares/IErrorsHandler";

const errorHandlerAdapterExpress = (
  error: ErrorTyped,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { message, status, errors, code, timestamp } = errorHandler(error);

  response.status(status).json({ message, errors, code, timestamp });
};

export { errorHandlerAdapterExpress };
