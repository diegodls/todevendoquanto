import { ErrorsCodeType } from "@/core/shared/errors/types/error-codes-type";

interface ensureIsAuthenticatedErrors {
  E_0_MDW_AUTH_0001: ErrorsCodeType;
}

export const ensureIsAuthenticatedErrors: ensureIsAuthenticatedErrors = {
  E_0_MDW_AUTH_0001: {
    code: "E_0_MDW_AUTH_0001",
    details: "Auth header not send",
    actions: "Client must send a AuthHeader with a valid Bearer Token",
    instance: "ensure-is-authenticated",
  },
};
