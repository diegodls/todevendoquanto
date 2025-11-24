import { ErrorsCodeType } from "@/core/shared/errors/types/error-codes-type";

export interface MiddlewareJWTAuthCodesInterface {
  E_0_MW_JWT_0001: ErrorsCodeType;
}

export const jwtAuthErrorCodes: MiddlewareJWTAuthCodesInterface = {
  E_0_MW_JWT_0001: {
    code: "E_0_MW_JWT_0001",
    details: "Invalid Token",
    actions: "Client side must send a valid token",
    instance: "JWTAuth",
  },
};
