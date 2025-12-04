import { ExpenseStatus } from "@/core/entities/expense";
import { CreateExpenseInputDTO } from "@/core/usecases/expense/create-expense-dto";
import { zodDefaultErrorHandler } from "@/infrastructure/validation/zod/helpers/zod-default-error-handler";
import z from "zod";

const today = new Date(new Date().setMonth(new Date().getMonth() + 1));

const monthsAhead = (quantity: number): Date => {
  return new Date(today.setMonth(today.getMonth() + quantity));
};

export const CreateExpenseBodySchema = z
  .object({
    name: z
      .string({
        error: zodDefaultErrorHandler,
      })
      .min(3, { message: "Name must have 3 or more caracteres" }),

    description: z
      .string({
        error: zodDefaultErrorHandler,
      })
      .max(256)
      .optional(),

    value: z
      .string({ error: zodDefaultErrorHandler })
      .transform((value) => Number(value))
      .pipe(z.number())
      .default(0)
      .optional(),

    status: z
      .string()
      .transform((value) => value.toUpperCase())
      .pipe(z.enum(ExpenseStatus))
      .default("PAYING")
      .optional(),

    expirationDate: z.date().default(monthsAhead(1)).optional(),

    tags: z.array(z.string()).default([""]).optional(),

    paymentSplitIn: z.number().default(1).optional(),

    paymentStartAt: z.date().default(monthsAhead(1)).optional(),

    paymentEndAt: z.date().default(monthsAhead(1)).optional(),
  })
  .strip() as z.ZodType<CreateExpenseInputDTO>;
