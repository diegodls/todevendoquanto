export const BillStatus = {
  ABANDONED: "ABANDONED",
  PAID: "PAID",
  PAYING: "PAYING",
} as const;

export type BillStatusType = (typeof BillStatus)[keyof typeof BillStatus];

export class Bill {
  public readonly id: string = "";
  public name: string = "";
  public description: string = "";
  public value: number = 0;
  public status: BillStatusType = BillStatus.PAYING;
  public expirationDate: Date = new Date();
  public tags: string[] = [];
  public paymentSplitIn: number = 1;
  public paymentStartAt: Date = new Date();
  public paymentEndAt: Date = new Date();
  public createdAt: Date = new Date();
  public updatedAt: Date = new Date();

  constructor(props: Partial<Bill>, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = crypto.randomUUID();
    }
  }
}

export type UserBillInvalidValidProps = Pick<
  Bill,
  "id" | "createdAt" | "updatedAt"
>;

export type UserBillValidProps = Partial<
  Omit<Bill, keyof UserBillInvalidValidProps>
>;
