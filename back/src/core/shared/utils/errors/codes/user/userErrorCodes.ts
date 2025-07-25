import {
  IUserControllerErrorCodes,
  IUserServiceErrorCodes,
} from "./IUserErrorCodes";

const userControllerErrorCodes: IUserControllerErrorCodes = {
  E_0_CTR_USR_0001: {
    code: "E_0_CTR_USR_0001",
    details: "Error on create new user",
    actions: "Check database connection, props, etc...",
    instance: "userController",
  },
};

const userServiceErrorCodes: IUserServiceErrorCodes = {
  E_0_SVC_USR_0001: {
    code: "E_0_SVC_USR_0001",
    details: "Error fetch JWT SECRET environment variable",
    actions: "Check environment variable or app folder....",
    instance: "userService",
  },
  E_0_SVC_USR_0002: {
    code: "E_0_SVC_USR_0002",
    details: "Error when generate encrypted password",
    actions: "Check bcrypt method",
    instance: "userService",
  },
};

export { userControllerErrorCodes, userServiceErrorCodes };
