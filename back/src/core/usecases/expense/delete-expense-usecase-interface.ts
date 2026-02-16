import { DeleteExpenseInputDTO } from "@/core/usecases/expense/delete-expense-dto";

export interface DeleteExpenseUseCaseInterface {
  execute: (data: DeleteExpenseInputDTO) => Promise<void>;
}
