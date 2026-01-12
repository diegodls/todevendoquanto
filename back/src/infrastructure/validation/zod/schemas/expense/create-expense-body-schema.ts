import {
  ExpenseStatus,
  expenseStatusValues,
} from "@/core/entities/expense/expense";
import { DECIMALS_REGEX } from "@/core/shared/regex/decimals";
import {
  CreateExpenseBodyInput,
  CreateExpenseInputDTO,
} from "@/core/usecases/expense/create-expense-dto";
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
    name: z
      .string({ error: zodDefaultErrorHandler })
      .min(3, { message: "Name must have 3 or more caracteres" })
      .nonempty({
        error: (issue) => {
          if (!issue.input || issue.input.length <= 0) {
            return `Name can't be empty`;
          }
        },
      }),

    description: z
      .string()
      .max(256, {
        error: (issue) => {
          if (issue.maximum) {
            return `Size of ${256} exceeded on ${issue.path}.`;
          }
        },
      })
      .default(""),

    amount: z
      .string({
        error: (issue) => {
          if (issue.code === "invalid_type") {
            return `Invalid type: ${
              issue.input
            }, expected string, received ${typeof issue.input}`;
          }
          return `Error on: ${issue.path}`;
        },
      })
      .regex(DECIMALS_REGEX, {
        error: (issue) => {
          if (issue.code === "invalid_format") {
            return `Invalid ${issue.input} format`;
          }
        },
      })
      .transform((value) => parseFloat(value))
      .optional()
      .default(0),

    totalAmount: z
      .string({
        error: (issue) => {
          if (issue.code === "invalid_type") {
            return `Invalid type: ${
              issue.input
            }, expected string, received ${typeof issue.input}`;
          }
          return `Error on: ${issue.path}`;
        },
      })
      .regex(DECIMALS_REGEX, {
        error: (issue) => {
          if (issue.code === "invalid_format") {
            return `Invalid ${issue.input} format`;
          }
        },
      })
      .transform((value) => parseFloat(value))
      .optional()
      .default(0),

    status: z
      .string()
      .toUpperCase()
      .optional()
      .pipe(
        z
          .enum(ExpenseStatus, {
            error: (issue) => {
              if (issue.code === "invalid_value") {
                return `${issue.input} is no a ${issue.path} valid type, pick one of: ${expenseStatusValues}`;
              }
            },
          })
          .default("PAYING")
      ),

    tags: z
      .array(
        z.string({
          error: zodDefaultErrorHandler,
        })
      )
      .optional()
      .default([""]),

    currentInstallment: z
      .number({
        error: zodDefaultErrorHandler,
      })
      .default(1),

    totalInstallment: z
      .number({
        error: zodDefaultErrorHandler,
      })
      .default(1),

    paymentDay: DateSchema.default(defaultToday),

    expirationDay: DateSchema.default(defaultToday),

    paymentStartAt: DateSchema.default(defaultToday),

    paymentEndAt: DateSchema.default(defaultToday),
  })
  .strip() satisfies z.ZodType<CreateExpenseInputDTO, CreateExpenseBodyInput>;
