import { ErrorsCodeType } from "@/core/shared/errors/types/error-codes-type";

interface ensureIsAuthenticatedErrors {
  E_0_MDW_AUTH_0001: ErrorsCodeType;
  E_0_MDW_AUTH_0002: ErrorsCodeType;
}

export const ensureIsAuthenticatedErrors: ensureIsAuthenticatedErrors = {
  E_0_MDW_AUTH_0001: {
    code: "E_0_MDW_AUTH_0001",
    details: "Auth header not send",
    actions: "Client must send a AuthHeader with a valid Bearer Token",
    instance: "ensure-is-authenticated",
  },
  E_0_MDW_AUTH_0002: {
    code: "E_0_MDW_AUTH_0002",
    details: "Bearer Token not present or malformed",
    actions: "Client must send a valid Bearer Token, with the required fields",
    instance: "ensure-is-authenticated",
  },
};
