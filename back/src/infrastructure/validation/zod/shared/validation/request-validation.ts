import { BadRequestError } from "@/core/shared/errors/api-errors";
import {
  AuthenticatedHttpRequestInterface,
  PublicHttpRequestInterface,
} from "@/core/shared/types/http-request-response";
import { requestValidationErrorCodes } from "@/infrastructure/validation/zod/shared/errors/requestValidation/request-validation-error-codes";
import { z, ZodSchema } from "zod";

type RequestTypes =
  | PublicHttpRequestInterface
  | AuthenticatedHttpRequestInterface;

type RequestPartType = "body" | "headers" | "params" | "query";

export const requestValidation = <
  TypeSchema extends ZodSchema<any, any, any>,
  PartTypes extends RequestPartType,
  RequestType extends RequestTypes
>(
  requestPart: PartTypes,
  request: RequestType,
  schema: TypeSchema
): z.output<TypeSchema> => {
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
