import { Expense } from "@/core/entities/expense";

export interface ExpenseRepositoryInterface {
  create: (expenses: Expense[]) => Promise<Expense[]>;
}
