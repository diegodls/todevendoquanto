import { ErrorsCodeType } from "@/core/shared/errors/types/error-codes-type";

interface ExpenseUseCaseErrors {
  E_0_BLU_ADM_0001: ErrorsCodeType;
}

export const expenseUseCaseErrors: ExpenseUseCaseErrors = {
  E_0_BLU_ADM_0001: {
    code: "E_0_BLU_ADM_0001",
    details: "Something went wrong when creating new user expense",
    actions: "Verify information send or create process",
    instance: "create-expense-usecase",
  },
};
