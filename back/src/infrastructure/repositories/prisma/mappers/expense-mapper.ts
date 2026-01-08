import { Expense as EntityExpense } from "@/core/entities/expense";
import { CreateExpenseOutputDTO } from "@/core/usecases/expense/create-expense-dto";
import { Expense as PrismaExpense } from "@/prisma";

export class ExpenseMapper {
  static toDomain(raw: PrismaExpense): EntityExpense {
    return EntityExpense.restore(raw.id, {
      name: raw.name,
      description: raw.description,
      amount: raw.amount,
      totalAmount: raw.totalAmount,
      status: raw.status,
      tags: raw.tags,
      actualInstallment: raw.actualInstallment,
      totalInstallment: raw.totalInstallment,
      paymentDay: raw.paymentDay,
      expirationDay: raw.expirationDay,
      paymentStartAt: raw.paymentStartAt,
      paymentEndAt: raw.paymentEndAt,
      userId: raw.userId,
      installmentId: raw.installmentId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(entity: EntityExpense): PrismaExpense {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      amount: entity.amount,
      totalAmount: entity.totalAmount,
      status: entity.status,
      tags: entity.tags,
      actualInstallment: entity.actualInstallment,
      totalInstallment: entity.totalInstallment,
      paymentDay: entity.paymentDay,
      expirationDay: entity.expirationDay,
      paymentStartAt: entity.paymentStartAt,
      paymentEndAt: entity.paymentEndAt,
      userId: entity.userId,
      installmentId: entity.installmentId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toCreateExpenseOutputDTO(
    expense: EntityExpense
  ): CreateExpenseOutputDTO {
    return {
      name: expense.name,
      description: expense.description,
      amount: expense.amount,
      totalAmount: expense.totalAmount,
      status: expense.status,
      tags: expense.tags,
      actualInstallment: expense.actualInstallment,
      totalInstallment: expense.totalInstallment,
      paymentDay: expense.paymentDay.toISOString(),
      expirationDay: expense.expirationDay.toISOString(),
      paymentStartAt: expense.paymentStartAt.toISOString(),
      paymentEndAt: expense.paymentEndAt.toISOString(),
    };
  }
}
