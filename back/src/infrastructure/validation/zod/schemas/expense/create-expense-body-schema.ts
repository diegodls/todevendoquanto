import { CreateExpenseBodyInput } from "@/core/usecases/expense/create-expense-dto";
import { zodDefaultErrorHandler } from "@/infrastructure/validation/zod/helpers/zod-default-error-handler";
import { DateSchema } from "@/infrastructure/validation/zod/schemas/shared/date-schema";
import z from "zod";

const defaultToday = () => {
  const defaultHourDrift = 12;
  // prevent drift, local 01/01/2026 11:00:00 ~> cloud 02/01/2026 00:00:00
  const now = new Date();
  now.setHours(defaultHourDrift, 0, 0);
  return now;
};

export const CreateExpenseBodySchema = z
  .object({
    name: z.string().optional(),

    description: z.string().optional().default(""),

    amount: z
      .number({
        error: (issue) => {
          if (issue.code === "invalid_type") {
            return `Invalid type: ${
              issue.input
            }, expected string, received ${typeof issue.input}`;
          }
          return `Error on: ${issue.path}`;
        },
      })
      .optional(),

    totalAmount: z
      .number({
        error: (issue) => {
          if (issue.code === "invalid_type") {
            return `Invalid type: ${
              issue.input
            }, expected string, received ${typeof issue.input}`;
          }
          return `Error on: ${issue.path}`;
        },
      })
      .optional(),

    status: z.string().toUpperCase().optional(),

    tags: z
      .array(
        z.string({
          error: zodDefaultErrorHandler,
        }),
      )
      .optional()
      .default([""]),

    currentInstallment: z
      .number({
        error: zodDefaultErrorHandler,
      })
      .default(1),

    totalInstallments: z
      .number({
        error: zodDefaultErrorHandler,
      })
      .default(1),

    paymentDay: DateSchema.default(defaultToday),

    expirationDay: DateSchema.default(defaultToday),

    paymentStartAt: DateSchema.default(defaultToday),

    paymentEndAt: DateSchema.default(defaultToday),
  })
  .strip() satisfies z.ZodType<CreateExpenseBodyInput>;
