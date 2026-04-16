import { Expense as EntityExpense } from "@/core/entities/expense/expense";
import { ExpenseDescription } from "@/core/entities/expense/value-objects/expense-description";
import { ExpenseId } from "@/core/entities/expense/value-objects/expense-id";
import { ExpenseName } from "@/core/entities/expense/value-objects/expense-name";
import { ExpenseStatus } from "@/core/entities/expense/value-objects/expense-status";
import { InstallmentId } from "@/core/entities/expense/value-objects/installment-id";
import { InstallmentInfo } from "@/core/entities/expense/value-objects/installment-info";
import { Money } from "@/core/entities/expense/value-objects/money";
import { PaymentSchedule } from "@/core/entities/expense/value-objects/payment-schedule";
import { Tags } from "@/core/entities/expense/value-objects/tags";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import { CreateExpenseOutputDTO } from "@/core/usecases/expense/create-expense-dto";
import { Expense as PrismaExpense } from "@/prisma/index";

export class ExpenseMapper {
  static toDomain(raw: PrismaExpense): EntityExpense {
    const expenseId = ExpenseId.from(raw.id);
    const name = ExpenseName.create(raw.name);
    const description = ExpenseDescription.create(raw.description);
    const status = ExpenseStatus.fromString(raw.status);
    const amount = Money.create(raw.amount, raw.currency);
    const totalAmount = Money.create(raw.totalAmount, raw.currency);
    const installmentInfo = InstallmentInfo.create(
      raw.currentInstallment,
      raw.totalInstallment,
    );
    const paymentSchedule = PaymentSchedule.create(
      raw.paymentDay,
      raw.expirationDay,
      raw.paymentStartAt,
      raw.paymentEndAt,
    );
    const tags = Tags.create(raw.tags);
    const userId = UserId.from(raw.userId);
    const installmentId = InstallmentId.from(raw.installmentId);

    return EntityExpense.restore(expenseId, {
      name,
      description,
      amount,
      totalAmount,
      status,
      tags,
      installmentInfo,
      paymentSchedule,
      userId,
      installmentId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(entity: EntityExpense): PrismaExpense {
    return {
      id: entity.id.toString(),
      name: entity.name.value,
      description: entity.description?.value || "",
      amount: entity.amount.cents,
      totalAmount: entity.totalAmount.cents,
      currency: entity.amount.currency,
      status: entity.status.value,
      tags: entity.tags.value,
      currentInstallment: entity.installmentInfo.current,
      totalInstallment: entity.installmentInfo.total,
      paymentDay: entity.paymentSchedule.paymentDay,
      expirationDay: entity.paymentSchedule.expirationDay,
      paymentStartAt: entity.paymentSchedule.startAt,
      paymentEndAt: entity.paymentSchedule.endAt,
      userId: entity.userId.toString(),
      installmentId: entity.installmentId.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toCreateExpenseOutputDTO(
    expense: EntityExpense,
  ): CreateExpenseOutputDTO {
    return {
      name: expense.name.value,
      description: expense.description?.value || "",
      amount: expense.amount.cents,
      totalAmount: expense.totalAmount.cents,
      currency: expense.amount.currency,
      status: expense.status.value,
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
