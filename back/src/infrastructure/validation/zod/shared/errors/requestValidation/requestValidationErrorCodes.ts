import { IRequestValidationErrorCodes } from "@/infrastructure/validation/zod/shared/errors/requestValidation/IRequestValidationErrorCodes";

export const requestValidationErrorCodes: IRequestValidationErrorCodes = {
  E_0_REQ_ZVL_0001: {
    code: "E_0_REQ_ZVL_0001",
    details: "User send params/query wrong",
    actions: "User must send a valid data",
    instance: "requestValidation",
  },
};
