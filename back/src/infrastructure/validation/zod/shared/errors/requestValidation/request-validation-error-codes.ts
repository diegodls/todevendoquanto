import { RequestValidationErrorCodesInterface } from "@/infrastructure/validation/zod/shared/errors/requestValidation/request-validation-error-codes-interface";

export const requestValidationErrorCodes: RequestValidationErrorCodesInterface =
  {
    E_0_REQ_ZVL_0001: {
      code: "E_0_REQ_ZVL_0001",
      details: "User send params/query wrong",
      actions: "User must send a valid data",
      instance: "requestValidation",
    },
  };
