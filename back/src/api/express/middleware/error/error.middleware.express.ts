import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../../util/api.errors";

export function errorMiddlewareExpress(
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status ?? 500;

  const message = error.message ?? "Internal Server Error";

  const errors = error.errors;

  const code = error.code;

  const timestamp = new Date().toLocaleString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  res.status(status).json({ message, errors, code, timestamp });
}
