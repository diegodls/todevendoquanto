import { ErrorsCodeType } from "@/core/shared/errors/types/error-codes-type";

export interface UseCasesErrorsCodesInterface {
  E_0_USC_USR_0001: {};
  E_0_USC_USR_0002: {};
  E_0_USC_USR_0003: ErrorsCodeType;
  E_0_USC_USR_0004: ErrorsCodeType;
  E_0_USC_USR_0005: ErrorsCodeType;
  E_0_USC_ADM_0006: ErrorsCodeType;
  E_0_USC_ADM_0007: ErrorsCodeType;
  E_0_USC_USR_0008: ErrorsCodeType;
  E_0_USC_USR_0009: ErrorsCodeType;
}

export const useCasesErrorsCodes: UseCasesErrorsCodesInterface = {
  E_0_USC_USR_0001: {},
  E_0_USC_USR_0002: {},
  E_0_USC_USR_0003: {
    code: "E_0_USC_USR_0003",
    details: "User not found with the logged user ID",
    actions: "User must be logged with a valid user with valid ID",
    instance: "userService",
  },
  E_0_USC_USR_0004: {
    code: "E_0_USC_USR_0004",
    details:
      "Logged user tried to update his data, but passed another data, mismatch of information",
    actions: "User must send the data of his profile",
    instance: "userService",
  },
  E_0_USC_USR_0005: {
    code: "E_0_USC_USR_0005",
    details: "The data send is the same on the database",
    actions: "User must send a different data",
    instance: "userService",
  },
  E_0_USC_ADM_0006: {
    code: "E_0_USC_ADM_0001",
    details: "Admin User not found with the given id",
    actions: "User must send a valid ID",
    instance: "adminService",
  },
  E_0_USC_ADM_0007: {
    code: "E_0_USC_ADM_0002",
    details: "User doesn't have ADMIN privileges",
    actions: "User must have ADMIN privileges",
    instance: "adminService",
  },
  E_0_USC_USR_0008: {
    code: "E_0_USC_USR_0008",
    details: "User's to be deleted not found",
    actions: "Admin must give a user's valid ID to be deleted",
    instance: "delete-user-usecase",
  },
  E_0_USC_USR_0009: {
    code: "E_0_USC_USR_0009",
    details: "ADMIN User's cannot be deleted on this route.",
    actions: "Use another route to delete a ADMIN USER",
    instance: "delete-user-usecase",
  },
};
