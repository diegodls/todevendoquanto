import { ErrorsCodeType } from "@/core/shared/errors/types/error-codes-type";

interface EncryptErrorsInterface {
  E_0_INF_ENC_0001: ErrorsCodeType;
}
export const encryptErrorsCodes: EncryptErrorsInterface = {
  E_0_INF_ENC_0001: {
    code: "E_0_INF_ENC_0001",
    details: "Error when generate encrypted string",
    actions: "Check bcrypt method",
    instance: "encrypt",
  },
};
