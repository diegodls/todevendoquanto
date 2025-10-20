import {
  AuthenticatedHttpRequest,
  PublicHttpRequest,
} from "@/core/shared/types/HttpRequestResponse";
import { BadRequestError } from "@/core/shared/utils/errors/ApiError";
import { requestValidationErrorCodes } from "@/infrastructure/validation/zod/shared/errors/requestValidation/requestValidationErrorCodes";
import { z, ZodSchema } from "zod";

type TRequestTypes = PublicHttpRequest | AuthenticatedHttpRequest;

type TRequestPart = "body" | "headers" | "params" | "query";

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
    const errors: Record<string, string> = {};

    for (const err of result.error.issues) {
      const errorPath = err.path[0].toLocaleString();
      errors[errorPath] = err.message;
    }

    throw new BadRequestError(
      "Error on data validation",
      errors,
      requestValidationErrorCodes.E_0_REQ_ZVL_0001.code
    );
  }

  return result.data;
};
