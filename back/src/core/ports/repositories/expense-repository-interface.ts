import { Expense } from "@/core/entities/expense/expense";
import { CreateExpenseOutputDTO } from "@/core/usecases/expense/create-expense-dto";

export interface ExpenseRepositoryInterface {
  findById: (id: Expense["id"]) => Promise<Expense | null>;
  create: (expenses: Expense[]) => Promise<CreateExpenseOutputDTO[]>;
  delete: (id: Expense["id"]) => Promise<void>;
}
