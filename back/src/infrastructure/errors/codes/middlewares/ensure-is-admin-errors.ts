import { ErrorsCodeType } from "@/core/shared/errors/types/error-codes-type";

interface ensureIsAdminErrors {
  E_0_MDW_ADM_0001: ErrorsCodeType;
}

export const ensureIsAdminErrors: ensureIsAdminErrors = {
  E_0_MDW_ADM_0001: {
    code: "E_0_MDW_ADM_0001",
    details: "User role is not ADMIN",
    actions: "Client must be ADMIN to continue",
    instance: "ensure-is-admin",
  },
};
