import { ExpenseId } from "@/core/entities/expense/value-objects/expense-id";
import { ExpenseName } from "@/core/entities/expense/value-objects/expense-name";
import { ExpenseStatus } from "@/core/entities/expense/value-objects/expense-status";
import { InstallmentId } from "@/core/entities/expense/value-objects/installment-id";
import { InstallmentInfo } from "@/core/entities/expense/value-objects/installment-info";
import { Money } from "@/core/entities/expense/value-objects/money";
import { PaymentSchedule } from "@/core/entities/expense/value-objects/payment-schedule";
import { Tags } from "@/core/entities/expense/value-objects/tags";

import { UserId } from "@/core/entities/user/value-objects/user-id";

type CreateExpenseInput = {
  name: string;
  description: string;
  amount: number;
  currentInstallment: number;
  totalInstallments: number;
  status: string;
  paymentDay: Date;
  expirationDay: Date;
  paymentStartAt: Date;
  paymentEndAt: Date;
  userId: UserId;
  installmentId: InstallmentId;
  tags?: string[];
  currency?: string;
};

type ExpenseProps = {
  name: ExpenseName;
  description: string;
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
  private _description: string;
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
    this._description = props.description;
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

  get description(): string {
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
    const name = ExpenseName.create(input.name);

    const amount = Money.fromCents(input.amount, input.currency);

    const totalAmount = amount.multiply(input.totalInstallments);

    const tags = Tags.create(input.tags);

    const status = input.status
      ? ExpenseStatus.fromString(input.status)
      : ExpenseStatus.paying();

    const installmentInfo = InstallmentInfo.create(
      input.currentInstallment,
      input.totalInstallments,
    );

    const paymentSchedule = PaymentSchedule.create(
      input.paymentDay,
      input.expirationDay,
      input.paymentStartAt,
      input.paymentEndAt,
    );

    return new Expense(
      {
        name,
        description: input.description,
        amount,
        totalAmount,
        status,
        tags,
        installmentInfo,
        paymentSchedule,
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

  public updateDetails(name: string, description: string): void {
    let hasChanged = false;
    const newName = ExpenseName.create(name);

    if (!this._name.equals(newName)) {
      this._name = newName;
      hasChanged = true;
    }

    if (this._description !== description) {
      this._description = description;
      hasChanged = true;
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

  public splitIntoInstallments(): Expense[] {
    if (this._installmentInfo.isSingle()) {
      return [this];
    }

    const moneySplitted: Money[] = this._totalAmount.split(
      this._installmentInfo.total,
    );

    if (moneySplitted.length !== this._installmentInfo.total) {
      throw new Error("Splitting expense error");
    }

    const installments: Expense[] = [];

    for (let i = 0; i < this._installmentInfo.total; i++) {
      const paymentDay: Date = this._status.isPaying()
        ? this.computeDate(this.paymentSchedule.paymentDay, i)
        : this.paymentSchedule.paymentDay;

      const expirationDay: Date = this.computeDate(
        this.paymentSchedule.expirationDay,
        i,
      );

      const paymentStartAt: Date = this.computeDate(
        this.paymentSchedule.startAt,
        i,
      );

      const paymentEndAt: Date = this.computeDate(
        this.paymentSchedule.endAt,
        i,
      );

      const paymentSchedule = PaymentSchedule.create(
        paymentDay,
        expirationDay,
        paymentStartAt,
        paymentEndAt,
      );

      const newExpense: Expense = new Expense({
        userId: this._userId,
        createdAt: this._createdAt,
        name: this._name,
        description: this._description,
        totalAmount: this._totalAmount,
        status: this._status,
        tags: this._tags,
        installmentInfo: this._installmentInfo,
        installmentId: this._installmentId,
        amount: moneySplitted[i],
        paymentSchedule: paymentSchedule,
        updatedAt: this._updatedAt,
      });

      console.log(newExpense);

      installments.push(newExpense);
    }

    return installments;
  }

  public markAsPaid(): void {
    this.assertCanBePaid();

    if (this._status.isPaid()) {
      return;
    }

    this._status.isPaid();
    this.touch();
  }

  public markAsAbandoned(): void {
    if (this._status.isAbandoned()) {
      return;
    }

    this._status.isAbandoned();
    this.touch();
  }

  public markAsPaying(): void {
    if (this._status.isPaying()) {
      return;
    }
    this._status.isPaying();
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

    const expectedTotal = this._amount.multiply(this._installmentInfo.total);

    if (this._totalAmount.amount !== expectedTotal.amount) {
      throw new Error(
        `Total amount (${this._totalAmount.amount}) must equal amount (${this._amount.amount}) × installments (${this._installmentInfo.total})`,
      );
    }

    if (this._status.isPaid() && !this._installmentInfo.isComplete()) {
      throw new Error(
        `Expense marked as PAID but installment is ${this._installmentInfo.current}/${this._installmentInfo.total}`,
      );
    }
  }

  private assertCanBePaid(): void {
    if (this._status.isAbandoned()) {
      throw new Error("Cannot mark abandoned expense as paid");
    }

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
