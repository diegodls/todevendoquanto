import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { CustomApiErrors } from "../../../../util/api.errors";
import { BodyValidateMiddlewareErrorsCodes } from "../../../../util/errors-codes/middleware.errors.codes/body.validate";

export const RequestBodyValidation =
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

      throw new CustomApiErrors.BadRequestError(
        "Internal Server Error.",
        errors,
        BodyValidateMiddlewareErrorsCodes.E_0_MW_BDY_0001.code
      );
    }

    req.body = result.data;

    next();
  };
