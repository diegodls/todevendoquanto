import { Expense } from "@/core/entities/expense";
import { ExpenseRepositoryInterface } from "@/core/ports/repositories/expense-repository-interface";
import {
  CreateExpenseOutputDTO,
  CreateExpenseUseCaseProps,
} from "@/core/usecases/expense/create-expense-dto";
import { PrismaClientGenerated } from "@/infrastructure/repositories/prisma/config/prisma-client";

export class ExpenseRepositoryPrisma implements ExpenseRepositoryInterface {
  constructor(private readonly prismaORMClient: PrismaClientGenerated) {}

  create({
    userId,
    expense,
  }: CreateExpenseUseCaseProps): Promise<CreateExpenseOutputDTO> {
    const expenseToBeCreated = new Expense(expense);

    const output = this.prismaORMClient.expenses.create({
      data: { ...expenseToBeCreated, userId },
    });

    return output;
  }
}
