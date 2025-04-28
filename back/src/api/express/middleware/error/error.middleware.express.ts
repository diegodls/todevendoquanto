import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../../util/api.errors";

export function errorMiddlewareExpress(
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = error.statusCode ?? 500;

  const message = error.statusCode ? error.message : "Internal Server Error";

  const errors = error.errors;

  res.status(statusCode).json({ message, errors });
}
