import { IUserControllerErrorCodes } from "./IUserErrorCodes";

const userErroCodes: IUserControllerErrorCodes = {
  E_0_CTR_USR_0001: {
    code: "E_0_CTR_USR_0001",
    details: "Error on create new user",
    actions: "Check database connection, props, etc...",
    instance: "userCOntroller",
  },
};

export { userErroCodes };
