import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { CustomApiErrors } from "../../../../util/api.errors";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const errorPath = err.path[0];
          errors[errorPath] = err.message;
        }
      });

      throw new CustomApiErrors.ErrorBadRequest(
        "Internal Server Error.",
        errors
      );
    }

    req.body = result.data;

    next();
  };
