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

type ExpenseProps = {
  name: string;
  description: string;
  amount: number;
  totalAmount: number;
  status: ExpenseStatusType;
  tags: string[];
  actualInstallment: number;
  totalInstallment: number;
  paymentDay: Date;
  expirationDay: Date;
  paymentStartAt: Date;
  paymentEndAt: Date;
  userId: UserId;
  installmentId: InstallmentId;
  createdAt: Date;
  updatedAt: Date;
};

export class Expense {
  private readonly _id: ExpenseId;
  private readonly _userId: UserId;
  private readonly _createdAt: Date;
  private _name: string;
  private _description: string;
  private _amount: number;
  private _totalAmount: number;
  private _status: ExpenseStatusType;
  private _tags: string[];
  private _actualInstallment: number;
  private _totalInstallment: number;
  private _paymentDay: Date;
  private _expirationDay: Date;
  private _paymentStartAt: Date;
  private _paymentEndAt: Date;
  private _installmentId: InstallmentId;
  private _updatedAt: Date;

  constructor(props: ExpenseProps, id?: ExpenseId) {
    this._id = id ?? crypto.randomUUID();
    this._userId = props.userId;
    this._createdAt = props.createdAt;
    this._name = props.name;
    this._description = props.description;
    this._amount = props.amount;
    this._totalAmount = props.totalAmount;
    this._status = props.status;
    this._tags = props.tags;
    this._actualInstallment = props.actualInstallment;
    this._totalInstallment = props.totalInstallment;
    this._paymentDay = props.paymentDay;
    this._expirationDay = props.expirationDay;
    this._paymentStartAt = props.paymentStartAt;
    this._paymentEndAt = props.paymentEndAt;
    this._installmentId = props.installmentId;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  get id(): ExpenseId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get amount(): number {
    return this._amount;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  get status(): ExpenseStatusType {
    return this._status;
  }

  get tags(): string[] {
    return this._tags;
  }

  get actualInstallment(): number {
    return this._actualInstallment;
  }

  get totalInstallment(): number {
    return this._totalInstallment;
  }

  get paymentDay(): Date {
    return this._paymentDay;
  }

  get expirationDay(): Date {
    return this._expirationDay;
  }

  get paymentStartAt(): Date {
    return this._paymentStartAt;
  }

  get paymentEndAt(): Date {
    return this._paymentEndAt;
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
    createProps: Omit<ExpenseProps, "createdAt" | "updatedAt" | "id">,
    id?: ExpenseId
  ): Expense {
    return new Expense(
      {
        ...createProps,
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
    if (!name) throw new Error("Name cannot be empty");

    this._name = name;

    this._description = description;

    this.touch();
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

  private validate(): void {
    if (!this._name || this._name.trim().length < 3) {
      throw new Error("Expense Name is required and must have at least 3 char");
    }

    if (this._amount <= 0) {
      throw new Error("Expense amount must be greater than zero");
    }

    if (isNaN(this._paymentDay.getTime())) {
      throw new Error("Invalid Payment date");
    }

    if (!this._userId) {
      throw new Error("Expense must belong to a user");
    }
  }
}

/*
export type UserExpenseInvalidValidProps = Pick<
  Expense,
  "id" | "installmentId" | "userId" | "createdAt" | "updatedAt"
>;

export type UserExpenseValidProps = Omit<
  Expense,
  keyof UserExpenseInvalidValidProps
>;


export class Expense {
  public readonly id: string = "";
  public installmentId: string = "";
  public userId: string = "";
  public createdAt: Date = new Date();
  public updatedAt: Date = new Date();
  public name: string = "";
  public description: string = "";
  public amount: number = 0;
  public totalAmount: number = 0;
  public status: ExpenseStatusType = ExpenseStatus.PAYING;
  public tags: string[] = [];
  public actualInstallment: number = 1;
  public totalInstallment: number = 1;
  public paymentDay: Date = new Date();
  public expirationDay: Date = new Date();
  public paymentStartAt: Date = new Date();
  public paymentEndAt: Date = new Date();

  constructor(props: Partial<Expense>, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = crypto.randomUUID();
    }
  }
}

*/
