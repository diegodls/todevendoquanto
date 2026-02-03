import { Expense } from "@/core/entities/expense/expense";
import { User } from "@/core/entities/user/user";

export interface DeleteExpenseUseCaseInterface {
  execute: (id: Expense["id"], userId: User["id"]) => Promise<void>;
}
