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
  E_0_CTR_USR_0002: {
    code: "E_0_CTR_USR_0002",
    details: "The data to update is not valid or aren't send ",
    actions: "User must send a valid data",
    instance: "UserUpdateController",
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
  E_0_SVC_USR_0003: {
    code: "E_0_SVC_USR_0003",
    details: "User not found with the logged user ID",
    actions: "User must be logged with a valid user with valid ID",
    instance: "userService",
  },
  E_0_SVC_USR_0004: {
    code: "E_0_SVC_USR_0004",
    details:
      "Logged user tried to update his data, but passed another data, mismatch of information",
    actions: "User must send the data of his profile",
    instance: "userService",
  },
  E_0_SVC_USR_0005: {
    code: "E_0_SVC_USR_0005",
    details: "The data send is the same on the database",
    actions: "User must send a different data",
    instance: "userService",
  },
};

export { userControllerErrorCodes, userServiceErrorCodes };
