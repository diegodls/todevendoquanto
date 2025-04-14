import { NextFunction, Request, Response } from "express";

export function errorMiddlewareExpress(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);

  res.status(500).json("🔵🔵🔵🔵 MIDDLEWARE DE ERROS !!!");
}
