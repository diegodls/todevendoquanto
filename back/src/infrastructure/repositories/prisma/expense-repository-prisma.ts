import { Expense } from "@/core/entities/expense/expense";
import { InstallmentId } from "@/core/entities/expense/value-objects/installment-id";
import { ExpenseRepositoryInterface } from "@/core/ports/repositories/expense-repository-interface";
import { CreateExpenseOutputDTO } from "@/core/usecases/expense/create-expense-dto";
import { PrismaClientGenerated } from "@/infrastructure/repositories/prisma/config/prisma-client";
import { ExpenseMapper } from "@/infrastructure/repositories/prisma/mappers/expense-mapper";

export class ExpenseRepositoryPrisma implements ExpenseRepositoryInterface {
  constructor(private readonly prismaORMClient: PrismaClientGenerated) {}

  async findInstallmentsById(id: InstallmentId): Promise<Expense[] | null> {
    const expenseExists = await this.prismaORMClient.expense.findMany({
      where: { installmentId: id.toString() },
    });

    return expenseExists
      ? expenseExists.map((e) => ExpenseMapper.toDomain(e))
      : null;
  }

  async create(expenses: Expense[]): Promise<CreateExpenseOutputDTO[]> {
    const prismaExpenses = expenses.map((e) => {
      return ExpenseMapper.toPersistence(e);
    });

    const created = await this.prismaORMClient.expense.createMany({
      data: prismaExpenses,
    });

    if (expenses.length === created.count) {
      return expenses.map((e) => ExpenseMapper.toCreateExpenseOutputDTO(e));
    }

    return [];
  }

  async deleteByInstallmentId(id: InstallmentId): Promise<void> {
    await this.prismaORMClient.expense.deleteMany({
      where: { installmentId: id.toString() },
    });
  }
}
