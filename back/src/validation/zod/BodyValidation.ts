import { ZodSchema } from "zod";
import { HttpRequest } from "../../types/HttpRequestResponse";
import { BadRequestError } from "../../utils/errors/ApiError";

const bodyValidation =
  <S>(schema: ZodSchema<S>) =>
  <R>(request: HttpRequest<R>): R => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      const errors: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        const errorPath = err.path[0].toLocaleString();
        errors[errorPath] = err.message;
        throw new BadRequestError("Error on validation", errors);
      });
    }

    return request.body;
  };

export { bodyValidation };
