import { ExpenseStatus, expenseStatusValues } from "@/core/entities/expense";
import { DECIMALS_REGEX } from "@/core/shared/regex/decimals";
import {
  CreateExpenseBodyInput,
  CreateExpenseInputDTO,
} from "@/core/usecases/expense/create-expense-dto";
import { zodDefaultErrorHandler } from "@/infrastructure/validation/zod/helpers/zod-default-error-handler";
import z from "zod";

const today = new Date();

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

    actualInstallment: z
      .number({
        error: zodDefaultErrorHandler,
      })
      .default(1),

    totalInstallment: z
      .number({
        error: zodDefaultErrorHandler,
      })
      .default(1),

    paymentDay: z
      .date({
        error: zodDefaultErrorHandler,
      })
      .default(today),

    expirationDay: z
      .date({
        error: zodDefaultErrorHandler,
      })
      .default(today),

    paymentStartAt: z
      .date({
        error: zodDefaultErrorHandler,
      })
      .default(today),

    paymentEndAt: z
      .date({
        error: zodDefaultErrorHandler,
      })
      .default(today),
  })
  .strip() satisfies z.ZodType<CreateExpenseInputDTO, CreateExpenseBodyInput>;
