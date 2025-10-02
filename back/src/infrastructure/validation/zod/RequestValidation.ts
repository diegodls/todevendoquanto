import {
  AuthenticatedHttpRequest,
  PublicHttpRequest,
} from "@/core/shared/types/HttpRequestResponse";
import { BadRequestError } from "@/core/shared/utils/errors/ApiError";
import { ZodSchema } from "zod";

type TRequest<B, H, P, Q> =
  | PublicHttpRequest<B, H, P, Q>
  | AuthenticatedHttpRequest<B, H, P, Q>;

type TRequestParts = "body" | "headers" | "params" | "query";

type CorrectTypeForPart<
  TargetType,
  P extends TRequestParts,
  Req
> = Req extends PublicHttpRequest<infer B, infer H, infer Pm, infer Q>
  ? P extends "body"
    ? Req extends { user: any }
      ? AuthenticatedHttpRequest<TargetType, H, Pm, Q>
      : PublicHttpRequest<TargetType, H, Pm, Q>
    : P extends "params"
    ? Req extends { user: any }
      ? AuthenticatedHttpRequest<B, H, TargetType, Q>
      : PublicHttpRequest<B, H, TargetType, Q>
    : P extends "query"
    ? Req extends { user: any }
      ? AuthenticatedHttpRequest<B, H, Pm, TargetType>
      : PublicHttpRequest<B, H, Pm, TargetType>
    : P extends "headers"
    ? Req extends { user: any }
      ? AuthenticatedHttpRequest<B, TargetType, Pm, Q>
      : PublicHttpRequest<B, TargetType, Pm, Q>
    : never
  : never;

const requestValidation = <TargetType>(
  requestPart: TRequestParts,
  request: CorrectTypeForPart<
    TargetType,
    TRequestParts,
    TRequest<any, any, any, any>
  >,
  schema: ZodSchema<TargetType>
): CorrectTypeForPart<
  TargetType,
  TRequestParts,
  TRequest<any, any, any, any>
>[TRequestParts] => {
  const result = schema.safeParse(request[requestPart]);

  if (!result.success) {
    const errors: Record<string, string> = {}; // Criar um tipo para os erros retornado no response dos erros (BadRequest/NotFound e etc...)

    result.error.issues.forEach((err) => {
      const errorPath = err.path[0].toLocaleString();
      errors[errorPath] = err.message;
      throw new BadRequestError("Error on validation", errors);
    });
  }

  return request[requestPart];
};

export { requestValidation };
