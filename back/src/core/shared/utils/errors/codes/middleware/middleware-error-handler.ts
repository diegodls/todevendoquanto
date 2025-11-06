import { MiddlewareErrorHandlerInterface } from "@/core/shared/utils/errors/codes/middleware/middleware-error-handler-interface";

export const MiddlewareErrorHandler: MiddlewareErrorHandlerInterface = {
  E_0_MW_ADM_0001: {
    code: "E_0_MW_ADM_0001",
    details: "Token expired",
    actions: "Client side must send new Bearer token",
    instance: "UserService",
  },
  E_0_MW_ADM_0002: {
    code: "E_0_MW_ADM_0002",
    details: "Generic error on JWT validation",
    actions: "Check database connection, props, etc...",
    instance: "UserService",
  },
  E_0_MW_ADM_0003: {
    code: "E_0_MW_ADM_0003",
    details: "Error on JWT validation time",
    actions: "Client side must send a valid Bearer token",
    instance: "UserService",
  },
};
