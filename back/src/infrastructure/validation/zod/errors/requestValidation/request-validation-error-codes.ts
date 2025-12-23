import { ErrorsCodeType } from "@/core/shared/errors/types/error-codes-type";

export interface RequestValidationErrorCodesInterface {
  E_0_REQ_ZVL_0001: ErrorsCodeType;
}

export const requestValidationErrorCodes: RequestValidationErrorCodesInterface =
  {
    E_0_REQ_ZVL_0001: {
      code: "E_0_REQ_ZVL_0001",
      details: "User send params/query wrong",
      actions: "User must send a valid data",
      instance: "requestValidation",
    },
  };
