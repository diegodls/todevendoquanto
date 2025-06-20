import {
  IAdminControllerErrorCodes,
  IAdminServiceErrorCodes,
} from "./IAdminErrorCodes";

const adminControllerErrorCodes: IAdminControllerErrorCodes = {
  E_0_CTR_ADM_0001: {
    code: "E_0_SVC_ADM_0001",
    details: "",
    actions: "",
    instance: "adminController",
  },
};

const adminServiceErrorCodes: IAdminServiceErrorCodes = {
  E_0_SVC_ADM_0001: {
    code: "E_0_SVC_ADM_0001",
    details: "Admin User not found with the given id",
    actions: "User must send a valid ID",
    instance: "adminService",
  },
  E_0_SVC_ADM_0002: {
    code: "E_0_SVC_ADM_0002",
    details: "User doesn't have ADMIN privileges",
    actions: "User must have ADMIN privileges",
    instance: "adminService",
  },
  E_0_SVC_ADM_0003: {
    code: "E_0_SVC_ADM_0003",
    details: "User's to be deleted not found",
    actions: "Admin must give a user's valid ID to be deleted",
    instance: "adminService",
  },
  E_0_SVC_ADM_0004: {
    code: "E_0_SVC_ADM_0004",
    details: "ADMIN User's cannot be deleted on this route.",
    actions: "Use another route to delete a ADMIN USER",
    instance: "adminService",
  },
};

export { adminControllerErrorCodes, adminServiceErrorCodes };
