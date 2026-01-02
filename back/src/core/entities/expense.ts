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

export type UserExpenseInvalidValidProps = Pick<
  Expense,
  "id" | "installmentId" | "userId" | "createdAt" | "updatedAt"
>;

export type UserExpenseValidProps = Omit<
  Expense,
  keyof UserExpenseInvalidValidProps
>;
