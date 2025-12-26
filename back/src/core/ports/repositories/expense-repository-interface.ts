import { Expense } from "@/core/entities/expense";

export interface ExpenseRepositoryInterface {
  findById: (id: Expense["id"]) => Promise<Expense | null>;
  create: (expenses: Expense[]) => Promise<Expense[]>;
  delete: (id: Expense["id"]) => Promise<void>;
}
