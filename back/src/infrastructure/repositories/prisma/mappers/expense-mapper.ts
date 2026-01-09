import { Expense as EntityExpense } from "@/core/entities/expense/expense";
import { ExpenseName } from "@/core/entities/expense/value-objects/expense-name";
import { Money } from "@/core/entities/expense/value-objects/money";
import { CreateExpenseOutputDTO } from "@/core/usecases/expense/create-expense-dto";
import { Expense as PrismaExpense } from "@/prisma";

export class ExpenseMapper {
  static toDomain(raw: PrismaExpense): EntityExpense {
    return EntityExpense.restore(raw.id, {
      name: ExpenseName.create(raw.name),
      description: raw.description,
      amount: Money.create(raw.amount, raw.currency),
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
      name: entity.name.value,
      description: entity.description,
      amount: entity.amount.amount,
      currency: entity.amount.currency,
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
      name: expense.name.value,
      description: expense.description,
      amount: expense.amount.amount,
      currency: expense.amount.currency,
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
