import { ExpenseDescription } from "@/core/entities/expense/value-objects/expense-description";
import { ExpenseId } from "@/core/entities/expense/value-objects/expense-id";
import { ExpenseName } from "@/core/entities/expense/value-objects/expense-name";
import {
  ExpenseStatus,
  ExpenseStatusValue,
} from "@/core/entities/expense/value-objects/expense-status";
import { InstallmentId } from "@/core/entities/expense/value-objects/installment-id";
import { InstallmentInfo } from "@/core/entities/expense/value-objects/installment-info";
import { Money } from "@/core/entities/expense/value-objects/money";
import { PaymentSchedule } from "@/core/entities/expense/value-objects/payment-schedule";
import { Tags } from "@/core/entities/expense/value-objects/tags";

import { UserId } from "@/core/entities/user/value-objects/user-id";

export type CreateExpenseInput = {
  name: ExpenseName;
  description: ExpenseDescription | null;
  amount: Money;
  totalAmount: Money;
  status: ExpenseStatus;
  tags: Tags;
  installmentInfo: InstallmentInfo;
  paymentSchedule: PaymentSchedule;
  userId: UserId;
  installmentId: InstallmentId;
};

type ExpenseProps = {
  name: ExpenseName;
  description: ExpenseDescription | null;
  amount: Money;
  totalAmount: Money;
  status: ExpenseStatus;
  tags: Tags;
  installmentInfo: InstallmentInfo;
  paymentSchedule: PaymentSchedule;
  userId: UserId;
  installmentId: InstallmentId;
  createdAt: Date;
  updatedAt: Date;
};

export class Expense {
  private readonly _id: ExpenseId;
  private readonly _userId: UserId;
  private readonly _createdAt: Date;
  private readonly _installmentId: InstallmentId;

  private _name: ExpenseName;
  private _description: ExpenseDescription | null;
  private _amount: Money;
  private _totalAmount: Money;
  private _status: ExpenseStatus;
  private _tags: Tags;
  private _installmentInfo: InstallmentInfo;
  private _paymentSchedule: PaymentSchedule;
  private _updatedAt: Date;

  private constructor(props: ExpenseProps, id?: ExpenseId) {
    this._id = id ?? ExpenseId.create();
    this._userId = props.userId;
    this._createdAt = props.createdAt;
    this._installmentId = props.installmentId;
    this._name = props.name;
    this._description = props.description || null;
    this._amount = props.amount;
    this._totalAmount = props.totalAmount;
    this._status = props.status;
    this._tags = props.tags;
    this._installmentInfo = props.installmentInfo;
    this._paymentSchedule = props.paymentSchedule;
    this._updatedAt = props.updatedAt;

    this.validateInvariants();
  }

  get id(): ExpenseId {
    return this._id;
  }

  get name(): ExpenseName {
    return this._name;
  }

  get description(): ExpenseDescription | null {
    return this._description;
  }

  get amount(): Money {
    return this._amount;
  }

  get totalAmount(): Money {
    return this._totalAmount;
  }

  get status(): ExpenseStatus {
    return this._status;
  }

  get tags(): Tags {
    return this._tags;
  }

  get installmentInfo(): InstallmentInfo {
    return this._installmentInfo;
  }

  get paymentSchedule(): PaymentSchedule {
    return this._paymentSchedule;
  }

  get userId(): UserId {
    return this._userId;
  }

  get installmentId(): InstallmentId {
    return this._installmentId;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt);
  }

  public static create(input: CreateExpenseInput, id?: ExpenseId): Expense {
    return new Expense(
      {
        name: input.name,
        description: input.description,
        amount: input.amount,
        totalAmount: input.totalAmount,
        status: input.status,
        tags: input.tags,
        installmentInfo: input.installmentInfo,
        paymentSchedule: input.paymentSchedule,
        userId: input.userId,
        installmentId: input.installmentId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );
  }

  public static restore(id: ExpenseId, props: ExpenseProps): Expense {
    return new Expense(props, id);
  }

  public static splitIntoInstallments(input: CreateExpenseInput): Expense[] {
    const expense = Expense.create(input);

    if (expense._installmentInfo.isSingle()) {
      return [expense];
    }

    const moneySplitted: Money[] = expense._amount.split(
      expense._installmentInfo.total,
    );

    if (moneySplitted.length !== expense._installmentInfo.total) {
      throw new Error("Splitting expense error");
    }

    let installments: Expense[] = [];

    for (let i = 0; i < expense._installmentInfo.total; i++) {
      const installmentInfo = InstallmentInfo.create(
        i + 1,
        expense.installmentInfo.total,
      );

      const paymentDay: Date = expense._status.isPaying()
        ? expense.computeDate(expense.paymentSchedule.paymentDay, i)
        : expense.paymentSchedule.paymentDay;

      const expirationDay: Date = expense.computeDate(
        expense.paymentSchedule.expirationDay,
        i,
      );

      const paymentStartAt: Date = expense.computeDate(
        expense.paymentSchedule.startAt,
        i,
      );

      const paymentEndAt: Date = expense.computeDate(
        expense.paymentSchedule.endAt,
        i,
      );

      const paymentSchedule = PaymentSchedule.create(
        paymentDay,
        expirationDay,
        paymentStartAt,
        paymentEndAt,
      );

      const newExpense: Expense = new Expense({
        userId: expense._userId,
        createdAt: expense._createdAt,
        name: expense._name,
        description: expense._description,
        totalAmount: expense._amount,
        status: expense._status,
        tags: expense._tags,
        installmentInfo,
        installmentId: expense._installmentId,
        amount: moneySplitted[i],
        paymentSchedule,
        updatedAt: expense._updatedAt,
      });

      installments.push(newExpense);
    }

    return installments;
  }

  public updateDetails(name?: string, description?: string): void {
    let hasChanged = false;

    if (name) {
      const newName = ExpenseName.create(name);

      if (!this._name.equals(newName)) {
        this._name = newName;
        hasChanged = true;
      }
    }

    if (description) {
      const newDescription = ExpenseDescription.create(description);

      if (!this._description?.equals(newDescription)) {
        this._description = newDescription;
        hasChanged = true;
      }
    }

    if (hasChanged) {
      this.touch();
    }
  }

  public addTag(tag: string): void {
    this._tags = this._tags.add(tag);
    this.touch();
  }

  public removeTag(tag: string): void {
    const newTags = this._tags.remove(tag);

    if (!newTags.equals(this._tags)) {
      this._tags = newTags;
      this.touch();
    }
  }

  public advanceInstallment(): void {
    if (this._status.isPaid()) {
      throw new Error("Cannot advance installment of paid expense");
    }

    if (this._status.isAbandoned()) {
      throw new Error("Cannot advance installment of abandoned expense");
    }

    if (this._installmentInfo.isComplete()) {
      throw new Error("Cannot advance: already at final installment");
    }

    this._installmentInfo = this._installmentInfo.next();
    this.touch();
  }

  public markAsPaid(): void {
    this.assertCanBePaid();

    if (this._status.isPaid()) {
      return;
    }

    this._status = this._status.transitionTo(ExpenseStatusValue.PAID);

    this.touch();
  }

  public markAsAbandoned(): void {
    if (this._status.isAbandoned()) {
      return;
    }

    this._status = this._status.transitionTo(ExpenseStatusValue.ABANDONED);

    this.touch();
  }

  public markAsPaying(): void {
    if (this._status.isPaying()) {
      return;
    }

    this._status = this._status.transitionTo(ExpenseStatusValue.PAYING);

    this.touch();
  }

  public isOverdue(referenceDate: Date = new Date()): boolean {
    return (
      this._paymentSchedule.isExpired(referenceDate) &&
      (this._status.isPaying() || this._status.isAbandoned())
    );
  }

  public canBePaid(): boolean {
    try {
      this.assertCanBePaid();
      return true;
    } catch {
      return false;
    }
  }

  public getDaysUntilExpiration(referenceDate: Date = new Date()): number {
    return this._paymentSchedule.daysUntilExpiration(referenceDate);
  }

  public getRemainingAmount(): Money {
    if (this._installmentInfo.isSingle()) {
      return this._status.isPaid()
        ? Money.zero(this._amount.currency)
        : this._amount;
    }

    const paidInstallments = this._installmentInfo.current - 1;
    const remainingInstallments =
      this._installmentInfo.total - paidInstallments;

    return this._amount.multiply(remainingInstallments);
  }

  private computeDate(baseDate: Date, monthsToAdd: number): Date {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const day = baseDate.getDate();

    let output = new Date(year, month + monthsToAdd);

    if (output.getDate() !== day) {
      output = new Date(year, month + monthsToAdd + 1, 0);
    }

    return output;
  }

  private validateInvariants(): void {
    if (!this._userId) {
      throw new Error("Expense must belong to a user");
    }

    if (!this._installmentId) {
      throw new Error("Expense must have an installment ID");
    }

    if (this._amount.currency !== this._totalAmount.currency) {
      throw new Error(
        `Amount and totalAmount must have same currency: ${this._amount.currency} vs ${this._totalAmount.currency}`,
      );
    }

    if (this._status.isPaid() && !this._installmentInfo.isComplete()) {
      throw new Error(
        `Expense marked as PAID but installment is ${this._installmentInfo.current}/${this._installmentInfo.total}`,
      );
    }
  }

  private assertCanBePaid(): void {
    if (!this._installmentInfo.isComplete()) {
      throw new Error(
        `Cannot mark as paid: installment ${this._installmentInfo.current}/${this._installmentInfo.total} is not complete`,
      );
    }
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
