import { ErrorsCodeType } from "@/core/shared/errors/types/error-codes-type";

export interface UserControllerErrorCodesInterface {
  E_0_CTR_USR_0001: ErrorsCodeType;
  E_0_CTR_USR_0002: ErrorsCodeType;
  E_0_CTR_ADM_0001: ErrorsCodeType;
  E_0_CTR_ADM_0002: ErrorsCodeType;
}

export const userControllerErrorCodes: UserControllerErrorCodesInterface = {
  E_0_CTR_USR_0001: {
    code: "E_0_CTR_USR_0001",
    details: "Error on create new user",
    actions: "Check database connection, props, etc...",
    instance: "userController",
  },
  E_0_CTR_USR_0002: {
    code: "E_0_CTR_USR_0002",
    details: "The data to update is not valid or aren't send ",
    actions: "User must send a valid data",
    instance: "UserUpdateController",
  },
  E_0_CTR_ADM_0001: {
    code: "E_0_CTR_ADM_0001",
    details: "Auth header not send",
    actions: "Client must send a AuthHeader with Bearer Token",
    instance: "adminController",
  },
  E_0_CTR_ADM_0002: {
    code: "E_0_CTR_ADM_0002",
    details: "Auth header not send",
    actions: "Client must send a AuthHeader with ADMIN role",
    instance: "adminController",
  },
};
