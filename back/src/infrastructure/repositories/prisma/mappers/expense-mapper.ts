import { Expense as EntityExpense } from "@/core/entities/expense/expense";
import { ExpenseName } from "@/core/entities/expense/value-objects/expense-name";
import { InstallmentInfo } from "@/core/entities/expense/value-objects/installment-info";
import { Money } from "@/core/entities/expense/value-objects/money";
import { PaymentSchedule } from "@/core/entities/expense/value-objects/payment-schedule";
import { Tags } from "@/core/entities/expense/value-objects/tags";
import { CreateExpenseOutputDTO } from "@/core/usecases/expense/create-expense-dto";
import { Expense as PrismaExpense } from "@/prisma";

export class ExpenseMapper {
  static toDomain(raw: PrismaExpense): EntityExpense {
    const name = ExpenseName.create(raw.name);
    const amount = Money.fromCents(raw.amount, raw.currency);
    const totalAmount = Money.fromCents(raw.totalAmount, raw.currency);
    const installmentInfo = InstallmentInfo.create(
      raw.currentInstallment,
      raw.totalInstallment
    );
    const paymentSchedule = PaymentSchedule.create(
      raw.paymentDay,
      raw.expirationDay,
      raw.paymentStartAt,
      raw.paymentEndAt
    );
    const tags = Tags.create(raw.tags);

    return EntityExpense.restore(raw.id, {
      name,
      description: raw.description,
      amount,
      totalAmount,
      status: raw.status,
      tags,
      installmentInfo,
      paymentSchedule,
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
      amount: entity.amount.cents,
      totalAmount: entity.totalAmount.cents,
      currency: entity.amount.currency,
      status: entity.status,
      tags: entity.tags.value,
      currentInstallment: entity.installmentInfo.current,
      totalInstallment: entity.installmentInfo.total,
      paymentDay: entity.paymentSchedule.paymentDay,
      expirationDay: entity.paymentSchedule.expirationDay,
      paymentStartAt: entity.paymentSchedule.startAt,
      paymentEndAt: entity.paymentSchedule.endAt,
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
      totalAmount: expense.totalAmount.amount,
      currency: expense.amount.currency,
      status: expense.status,
      tags: expense.tags.value,
      currentInstallment: expense.installmentInfo.current,
      totalInstallment: expense.installmentInfo.total,
      paymentDay: expense.paymentSchedule.paymentDay.toISOString(),
      expirationDay: expense.paymentSchedule.expirationDay.toISOString(),
      paymentStartAt: expense.paymentSchedule.startAt.toISOString(),
      paymentEndAt: expense.paymentSchedule.endAt.toISOString(),
    };
  }
}
