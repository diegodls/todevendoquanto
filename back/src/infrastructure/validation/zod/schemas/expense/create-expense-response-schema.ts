import { CreateExpenseOutputDTO } from "@/core/usecases/expense/create-expense-dto";
import z from "zod";

export const CreateExpenseResponseSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    amount: z.number(),
    currency: z.string(),
    totalAmount: z.number(),
    status: z.string(),
    tags: z.array(z.string()),
    currentInstallment: z.number(),
    totalInstallment: z.number(),
    paymentDay: z.string(),
    expirationDay: z.string(),
    paymentStartAt: z.string(),
    paymentEndAt: z.string(),
  })
  .strip() satisfies z.ZodType<CreateExpenseOutputDTO>;
