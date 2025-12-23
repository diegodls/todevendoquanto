import { ErrorsCodeType } from "@/core/shared/errors/types/error-codes-type";

export interface MiddlewareJWTAuthCodesInterface {
  E_0_MW_JWT_0001: ErrorsCodeType;
  E_0_MW_JWT_0002: ErrorsCodeType;
}

export const jwtAuthErrorCodes: MiddlewareJWTAuthCodesInterface = {
  E_0_MW_JWT_0001: {
    code: "E_0_MW_JWT_0001",
    details: "Invalid Token",
    actions: "Client side must send a valid token",
    instance: "jwt-verify-token",
  },
  E_0_MW_JWT_0002: {
    code: "E_0_MW_JWT_0002",
    details: "Error fetch JWT SECRET environment variable",
    actions: "Check environment variable or app folder....",
    instance: "jwt-generate-token",
  },
};
