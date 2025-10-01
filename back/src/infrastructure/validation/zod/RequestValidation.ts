import {
  AuthenticatedHttpRequest,
  PublicHttpRequest,
} from "@/core/shared/types/HttpRequestResponse";
import { BadRequestError } from "@/core/shared/utils/errors/ApiError";
import { ZodSchema } from "zod";

type TRequestParts = "body" | "headers" | "params" | "query";

type TRequestStructure<Part extends TRequestParts, TargetType> = {
  body: Part extends "body" ? TargetType : {};
  headers: Part extends "headers" ? TargetType : {};
  params: Part extends "params" ? TargetType : {};
  query: Part extends "query" ? TargetType : {};
};

const requestValidation =
  <S>(schema: ZodSchema<S>) =>
  <B, H, P, Q>(
    request:
      | PublicHttpRequest<B, H, P, Q>
      | AuthenticatedHttpRequest<B, H, P, Q>,
    requestPart: TRequestParts
  ): B | H | P | Q => {
    const result = schema.safeParse(request[requestPart]);

    if (!result.success) {
      const errors: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        const errorPath = err.path[0].toLocaleString();
        errors[errorPath] = err.message;
        throw new BadRequestError("Error on validation", errors);
      });
    }

    return request[requestPart];
  };

export { requestValidation };
