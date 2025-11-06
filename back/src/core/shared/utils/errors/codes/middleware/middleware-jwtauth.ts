import { MiddlewareJWTAuthCodesInterface } from "@/core/shared/utils/errors/codes/middleware/middleware-jwtauth-interface";

export const MiddlewareJWTAuthCodes: MiddlewareJWTAuthCodesInterface = {
  E_0_MW_JWT_0001: {
    code: "E_0_MW_JWT_0001",
    details: "Invalid Token",
    actions: "Client side must send a valid token",
    instance: "JWTAuth",
  },
};
