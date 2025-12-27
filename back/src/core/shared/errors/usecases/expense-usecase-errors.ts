import { ErrorsCodeType } from "@/core/shared/errors/types/error-codes-type";

interface ExpenseUseCaseErrors {
  E_0_BLU_ADM_0001: ErrorsCodeType;
}

export const expenseUseCaseErrors: ExpenseUseCaseErrors = {
  E_0_BLU_ADM_0001: {
    code: "E_0_BLU_ADM_0001",
    details: "Something went wrong when creating new user expense",
    actions: "Verify information send or creation process",
    instance: "create-expense-usecase",
  },
};

interface DeleteExpenseUseCaseErrors {
  E_0_DEU_NFE_0001: ErrorsCodeType;
  E_0_DEU_NFE_0002: ErrorsCodeType;
}
export const deleteExpenseUseCaseErrors: DeleteExpenseUseCaseErrors = {
  E_0_DEU_NFE_0001: {
    code: "E_0_DEU_NFE_0001",
    details: "Expense not found with ID provided",
    actions: "Verify information send or finding process",
    instance: "delete-expense-usecase",
  },

  E_0_DEU_NFE_0002: {
    code: "E_0_DEU_NFE_0002",
    details: "User can't delete expense",
    actions: "Verify users permissions or role",
    instance: "delete-expense-usecase",
  },
};
