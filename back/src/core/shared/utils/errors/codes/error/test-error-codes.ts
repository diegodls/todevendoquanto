import {
  ErrorControllerErrorCodesInterface,
  ErrorServiceErrorCodesInterface,
} from "@/core/shared/utils/errors/codes/error/test-error-codes-interface";

export const testControllerErrorCodes: ErrorControllerErrorCodesInterface = {
  E_0_CTR_ERR_0001: {
    code: "E_0_CTR_ERR_0001",
    actions: "Nothing, just testing...",
    details: "Test Route for throwing error on controller",
    instance: "errorController",
  },
};

export const testServiceErrorCodes: ErrorServiceErrorCodesInterface = {
  E_0_SVC_ERR_0001: {
    code: "E_0_SVC_TST_0001",
    actions: "Nothing, just testing...",
    details: "Test Route for throwing error on service",
    instance: "errorService",
  },
};
