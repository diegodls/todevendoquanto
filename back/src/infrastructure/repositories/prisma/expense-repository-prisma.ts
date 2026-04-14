import { Expense } from "@/core/entities/expense/expense";
import { InstallmentId } from "@/core/entities/expense/value-objects/installment-id";
import { ExpenseRepositoryInterface } from "@/core/ports/repositories/expense-repository-interface";
import { InternalError } from "@/core/shared/errors/api-errors";
import { CreateExpenseOutputDTO } from "@/core/usecases/expense/create-expense-dto";
import { PrismaClientGenerated } from "@/infrastructure/repositories/prisma/config/prisma-client";
import { ExpenseMapper } from "@/infrastructure/repositories/prisma/mappers/expense-mapper";

export class ExpenseRepositoryPrisma implements ExpenseRepositoryInterface {
  constructor(private readonly prismaORMClient: PrismaClientGenerated) {}

  async findInstallmentById(id: InstallmentId): Promise<Expense[] | null> {
    const expenseExists = await this.prismaORMClient.expense.findMany({
      where: { installmentId: id.toString() },
    });

    if (!expenseExists || expenseExists.length <= 0) {
      return null;
    }

    return expenseExists.map((e) => ExpenseMapper.toDomain(e));
  }

  async create(expenses: Expense[]): Promise<CreateExpenseOutputDTO[]> {
    const prismaExpenses = expenses.map((e) => {
      return ExpenseMapper.toPersistence(e);
    });

    const created = await this.prismaORMClient.expense.createMany({
      data: prismaExpenses,
    });

    if (!created || created.count !== expenses.length) {
      throw new InternalError(
        "Error when creating expenses, expenses created mismatch with informed expenses.",
      );
    }

    return expenses.map((e) => ExpenseMapper.toCreateExpenseOutputDTO(e));
  }

  async deleteByInstallmentId(id: InstallmentId): Promise<void> {
    await this.prismaORMClient.expense.deleteMany({
      where: { installmentId: id.toString() },
    });
  }
}
