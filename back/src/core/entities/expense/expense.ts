import { ExpenseName } from "@/core/entities/expense/value-objects/expense-name";
import { InstallmentInfo } from "@/core/entities/expense/value-objects/installment-info";
import { Money } from "@/core/entities/expense/value-objects/money";
import { PaymentSchedule } from "@/core/entities/expense/value-objects/payment-schedule";
import { Tags } from "@/core/entities/expense/value-objects/tags";

import { ExpenseId, InstallmentId, UserId } from "@/core/entities/shared/types";

export const ExpenseStatus = {
  ABANDONED: "ABANDONED",
  PAID: "PAID",
  PAYING: "PAYING",
} as const;

export type ExpenseStatusType =
  (typeof ExpenseStatus)[keyof typeof ExpenseStatus];

export const expenseStatusValues = Object.values(ExpenseStatus) as [
  ExpenseStatusType,
  ...ExpenseStatusType[]
];

type CreateExpenseInput = {
  name: string;
  description: string;
  amount: number;
  totalAmount: number;
  status: ExpenseStatusType;
  tags: string[];
  currentInstallment: number;
  totalInstallment: number;
  paymentDay: Date;
  expirationDay: Date;
  paymentStartAt: Date;
  paymentEndAt: Date;
  userId: UserId;
  installmentId: InstallmentId;
};

type ExpenseProps = {
  name: ExpenseName;
  description: string;
  amount: Money;
  totalAmount: Money;
  status: ExpenseStatusType;
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
  private _status: ExpenseStatusType;
  private _tags: Tags;
  private _installmentInfo: InstallmentInfo;
  private _paymentSchedule: PaymentSchedule;
  private _updatedAt: Date;

  constructor(props: ExpenseProps, id?: ExpenseId) {
    this._id = id ?? crypto.randomUUID();
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

  get status(): ExpenseStatusType {
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

  get installmentId(): string {
    return this._installmentId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public static create(
    createProps: CreateExpenseInput,
    id?: ExpenseId
  ): Expense {
    const name = ExpenseName.create(createProps.name);
    const amount = Money.fromCents(createProps.amount);
    const totalAmount = Money.fromCents(createProps.totalAmount);
    const installmentInfo = InstallmentInfo.create(
      createProps.currentInstallment,
      createProps.totalInstallment
    );
    const paymentSchedule = PaymentSchedule.create(
      createProps.paymentDay,
      createProps.expirationDay,
      createProps.paymentStartAt,
      createProps.paymentEndAt
    );

    const tags = Tags.create(createProps.tags);

    return new Expense(
      {
        ...createProps,
        name,
        amount,
        totalAmount,
        installmentInfo,
        paymentSchedule,
        tags,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id
    );
  }

  public static restore(id: ExpenseId, restoreProps: ExpenseProps): Expense {
    return new Expense(restoreProps, id);
  }

  public updateDetails(name: string, description: string): void {
    const newName = ExpenseName.create(name);

    if (!this._name.equals(newName)) {
      this._name = newName;

      this.touch();
    }

    if (this._description !== description) {
      this._description = description;

      this.touch();
    }
  }

  public markAsPaid(): void {
    if (this._status === "PAID") return;

    this._status = "PAID";

    this.touch();
  }

  public markAsAbandoned(): void {
    if (this._status === "ABANDONED") return;

    this._status = "ABANDONED";

    this.touch();
  }

  public markAsPaying(): void {
    if (this._status === "PAYING") return;

    this._status = "PAYING";

    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
