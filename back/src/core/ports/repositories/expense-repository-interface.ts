import { Expense } from "@/core/entities/expense/expense";
import { CreateExpenseOutputDTO } from "@/core/usecases/expense/create-expense-dto";

export interface ExpenseRepositoryInterface {
  findInstallmentsById: (
    id: Expense["installmentId"],
  ) => Promise<Expense[] | null>;
  create: (expenses: Expense[]) => Promise<CreateExpenseOutputDTO[]>;
  deleteByInstallmentId: (id: Expense["installmentId"]) => Promise<void>;
}
