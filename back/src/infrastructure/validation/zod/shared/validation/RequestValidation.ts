import {
  AuthenticatedHttpRequest,
  PublicHttpRequest,
} from "@/core/shared/types/HttpRequestResponse";
import { BadRequestError } from "@/core/shared/utils/errors/ApiError";
import { z, ZodSchema } from "zod";

type TRequestTypes = PublicHttpRequest | AuthenticatedHttpRequest;

type TRequestPart = "body" | "headers" | "params" | "query";

type CorrectTypeForPart<
  TargetType,
  Part extends TRequestPart,
  Req
> = Req extends PublicHttpRequest<infer B, infer H, infer P, infer Q>
  ? Part extends "body"
    ? Req extends { user: any }
      ? AuthenticatedHttpRequest<TargetType, H, P, Q>
      : PublicHttpRequest<TargetType, H, P, Q>
    : Part extends "params"
    ? Req extends { user: any }
      ? AuthenticatedHttpRequest<B, H, TargetType, Q>
      : PublicHttpRequest<B, H, TargetType, Q>
    : Part extends "query"
    ? Req extends { user: any }
      ? AuthenticatedHttpRequest<B, H, P, TargetType>
      : PublicHttpRequest<B, H, P, TargetType>
    : Part extends "headers"
    ? Req extends { user: any }
      ? AuthenticatedHttpRequest<B, TargetType, P, Q>
      : PublicHttpRequest<B, TargetType, P, Q>
    : never
  : never;

export const requestValidation = <
  TSchema extends ZodSchema<any, any, any>,
  TPart extends TRequestPart,
  TRequest extends TRequestTypes
>(
  requestPart: TPart,
  request: TRequest,
  schema: TSchema
): z.output<TSchema> => {
  const result = schema.safeParse(request[requestPart]);

  if (!result.success) {
    const errors: Record<string, string> = {}; // Criar um tipo para os erros retornado no response dos erros (BadRequest/NotFound e etc...)

    result.error.issues.forEach((err) => {
      const errorPath = err.path[0].toLocaleString();
      errors[errorPath] = err.message;
      throw new BadRequestError("Error on validation", errors);
    });
  }

  return result.data;
};

/* // ! @ 
export const requestValidation = <TSchema extends ZodSchema<any, any, any>>(
  requestPart: TRequestPart,
  request: CorrectTypeForPart<z.infer<TSchema>, TRequestPart, TRequest>,
  schema: TSchema
): CorrectTypeForPart<
  z.infer<TSchema>,
  TRequestPart,
  TRequest
>[TRequestPart] => {
  const result = schema.safeParse(request[requestPart]);

  if (!result.success) {
    const errors: Record<string, string> = {}; // Criar um tipo para os erros retornado no response dos erros (BadRequest/NotFound e etc...)

    result.error.issues.forEach((err) => {
      const errorPath = err.path[0].toLocaleString();
      errors[errorPath] = err.message;
      throw new BadRequestError("Error on validation", errors);
    });
  }

  return result.data;
};


export const requestValidation = <TOutput, TInput>(
  requestPart: TRequestParts,
  request: CorrectTypeForPart<TOutput, TRequestParts, TRequest>,
  schema: ZodSchema<TOutput, any, TInput>
): CorrectTypeForPart<TOutput, TRequestParts, TRequest>[TRequestParts] => {
  const result = schema.safeParse(request[requestPart]);

  if (!result.success) {
    const errors: Record<string, string> = {}; // Criar um tipo para os erros retornado no response dos erros (BadRequest/NotFound e etc...)

    result.error.issues.forEach((err) => {
      const errorPath = err.path[0].toLocaleString();
      errors[errorPath] = err.message;
      throw new BadRequestError("Error on validation", errors);
    });
  }

  return result.data;
};

export const requestValidation = <TOutput, TInput>(
  requestPart: TRequestParts,
  request: CorrectTypeForPart<TOutput, TRequestParts, TRequest>,
  schema: ZodSchema<TOutput, any, TInput>
): CorrectTypeForPart<TOutput, TRequestParts, TRequest>[TRequestParts] => {
  const result = schema.safeParse(request[requestPart]);

  if (!result.success) {
    const errors: Record<string, string> = {}; // Criar um tipo para os erros retornado no response dos erros (BadRequest/NotFound e etc...)

    result.error.issues.forEach((err) => {
      const errorPath = err.path[0].toLocaleString();
      errors[errorPath] = err.message;
      throw new BadRequestError("Error on validation", errors);
    });
  }

  return result.data;
};
*/
