import { Expense } from "@/core/entities/expense";
import { ExpenseId } from "@/core/entities/shared/types";
import { ExpenseRepositoryInterface } from "@/core/ports/repositories/expense-repository-interface";
import { CreateExpenseOutputDTO } from "@/core/usecases/expense/create-expense-dto";
import { PrismaClientGenerated } from "@/infrastructure/repositories/prisma/config/prisma-client";
import { ExpenseMapper } from "@/infrastructure/repositories/prisma/mappers/expense-mapper";

export class ExpenseRepositoryPrisma implements ExpenseRepositoryInterface {
  constructor(private readonly prismaORMClient: PrismaClientGenerated) {}

  async findById(id: ExpenseId): Promise<Expense | null> {
    const expenseExists = await this.prismaORMClient.expense.findFirst({
      where: { id },
    });

    return expenseExists ? ExpenseMapper.toDomain(expenseExists) : null;
  }

  async create(expenses: Expense[]): Promise<CreateExpenseOutputDTO[]> {
    const prismaExpenses = expenses.map((e) => {
      console.log(e);

      return ExpenseMapper.toPersistence(e);
    });

    // return expenses;

    const created = await this.prismaORMClient.expense.createMany({
      data: prismaExpenses,
    });

    if (expenses.length === created.count) {
      return expenses.map((e) => ExpenseMapper.toCreateExpenseOutputDTO(e));
    }

    return [];
  }

  async delete(id: ExpenseId): Promise<void> {
    await this.prismaORMClient.expense.delete({ where: { id } });
  }
}
