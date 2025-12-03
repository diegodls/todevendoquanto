import {
  CreateBillInputDTO,
  CreateBillProps,
} from "@/core/usecases/bill/create-bill-dto";
import z from "zod";

export const CreateBillBodySchema = z
  .object({
    name: z.string(),

    /* public name: string = "";
    public description: string = "";
    public value: number = 0;
    public status: BillStatusType = BillStatus.PAYING;
    public expirationDate: Date = new Date();
    public tags: string[] = [];
    public paymentSplitIn: number = 1;
    public paymentStartAt: Date = new Date();
    public paymentEndAt: Date = new Date();*/
  })
  .strip() satisfies z.ZodType<CreateBillProps, CreateBillInputDTO>;
