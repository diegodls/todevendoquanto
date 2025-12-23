import { ErrorsCodeType } from "@/core/shared/errors/types/error-codes-type";

export interface MiddlewareErrorHandlerInterface {
  E_0_HAN_JWT_0001: ErrorsCodeType;
  E_0_HAN_JWT_0002: ErrorsCodeType;
  E_0_HAN_JWT_0003: ErrorsCodeType;
}

export const errorHandlerErrorCodes: MiddlewareErrorHandlerInterface = {
  E_0_HAN_JWT_0001: {
    code: "E_0_HAN_JWT_0001",
    details: "Token expired",
    actions: "Client side must send new Bearer token",
    instance: "ErrorHandler jsonwebtoken",
  },
  E_0_HAN_JWT_0002: {
    code: "E_0_HAN_JWT_0002",
    details: "Generic error on JWT validation",
    actions: "Check database connection, props, etc...",
    instance: "ErrorHandler jsonwebtoken",
  },
  E_0_HAN_JWT_0003: {
    code: "E_0_HAN_JWT_0003",
    details: "Error on JWT validation time",
    actions: "Client side must send a valid Bearer token",
    instance: "ErrorHandler jsonwebtoken",
  },
};
