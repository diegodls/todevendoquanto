import { IMiddlewareJWTAuthCodes } from "./IMiddlewareJWTAuthCodes";

const MiddlewareJWTAuthCodes: IMiddlewareJWTAuthCodes = {
  E_0_MW_JWT_0001: {
    code: "E_0_MW_JWT_0001",
    details: "Invalid Token",
    actions: "Client side must send a valid token",
    instance: "JWTAuth",
  },
};

export { MiddlewareJWTAuthCodes };
