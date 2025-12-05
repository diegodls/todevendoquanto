import { ExpenseStatus } from "@/core/entities/expense";
import { monthsAhead } from "@/core/shared/helpers/date-month-ahead";
import { CreateExpenseInputDTO } from "@/core/usecases/expense/create-expense-dto";
import { zodDefaultErrorHandler } from "@/infrastructure/validation/zod/helpers/zod-default-error-handler";
import z from "zod";

export const CreateExpenseBodySchema = z
  .object({
    userId: z.string().optional().default(""),

    name: z
      .string({ error: zodDefaultErrorHandler })
      .min(3, { message: "Name must have 3 or more caracteres" }),

    description: z
      .string({ error: zodDefaultErrorHandler })
      .max(256, {
        error: (issue) => {
          if (issue.maximum) {
            return `Size of ${256} exceeded on ${issue.path}.`;
          }
        },
      })
      .optional()
      .default(""),

    amount: z.number({ error: zodDefaultErrorHandler }).optional().default(0),

    totalAmount: z
      .number({ error: zodDefaultErrorHandler })
      .optional()
      .default(0),

    status: z
      .string({ error: zodDefaultErrorHandler })
      .transform((value) => value.toUpperCase())
      .pipe(z.enum(ExpenseStatus))
      .optional()
      .default("PAYING"),

    tags: z
      .array(
        z.string({
          error: zodDefaultErrorHandler,
        })
      )
      .optional()
      .default([""]),

    actualInstallment: z
      .number({
        error: zodDefaultErrorHandler,
      })
      .optional()
      .default(1),

    totalInstallment: z
      .number({
        error: zodDefaultErrorHandler,
      })
      .optional()
      .default(1),

    paymentDay: z
      .date({
        error: zodDefaultErrorHandler,
      })
      .optional()
      .default(monthsAhead(1)),

    expirationDay: z
      .date({
        error: zodDefaultErrorHandler,
      })
      .optional()
      .default(monthsAhead(1)),

    paymentStartAt: z
      .date({
        error: zodDefaultErrorHandler,
      })
      .optional()
      .default(monthsAhead(1)),

    paymentEndAt: z
      .date({
        error: zodDefaultErrorHandler,
      })
      .optional()
      .default(monthsAhead(1)),

      TIRAR ESSAS VERIFICAÇÕES DO ZOD E MOVER PARA O USECASE
      CASO NÃO SEJA PASSADO O paymentStartAt/paymentEndAt
      O USECASE DEVE CALCULAR COM BASE NO DIA ATUAL
      TEM QUE VER O QUE O USECASE ESTÁ RECEBENDO DO CONTROLLER
  })
  .strip() satisfies z.ZodType<CreateExpenseInputDTO>;
