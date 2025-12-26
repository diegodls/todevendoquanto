import { Expense } from "@/core/entities/expense";
import { ExpenseRepositoryInterface } from "@/core/ports/repositories/expense-repository-interface";
import { PrismaClientGenerated } from "@/infrastructure/repositories/prisma/config/prisma-client";

export class ExpenseRepositoryPrisma implements ExpenseRepositoryInterface {
  constructor(private readonly prismaORMClient: PrismaClientGenerated) {}

  async findById(id: Expense["id"]): Promise<Expense | null> {
    const expenseExists = await this.prismaORMClient.expense.findFirst({
      where: { id },
    });

    return expenseExists;
  }

  async create(expenses: Expense[]): Promise<Expense[]> {
    const output = await this.prismaORMClient.expense.createMany({
      data: expenses,
    });

    if (expenses.length === output.count) {
      return expenses;
    }

    return [];
  }

  async delete(id: Expense["id"]): Promise<void> {
    await this.prismaORMClient.expense.delete({ where: { id } });
  }
}
