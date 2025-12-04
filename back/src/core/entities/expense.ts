export const ExpenseStatus = {
  ABANDONED: "ABANDONED",
  PAID: "PAID",
  PAYING: "PAYING",
} as const;

export type ExpenseStatusType =
  (typeof ExpenseStatus)[keyof typeof ExpenseStatus];

export class Expense {
  public readonly id: string = "";
  public readonly expenseId: string = "";
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
  public paymentDay: number = 1;
  public expirationDay: number = 1;
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
  "id" | "expenseId" | "createdAt" | "updatedAt"
>;

export type UserExpenseValidProps = Partial<
  Omit<Expense, keyof UserExpenseInvalidValidProps>
>;
