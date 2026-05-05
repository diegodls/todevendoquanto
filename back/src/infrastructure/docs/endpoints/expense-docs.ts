import { EXPENSE_ROUTES_PATH } from "@/core/ports/infrastructure/http/app-routes-paths";
import {
  badRequestResponse,
  buildOpenApiPath,
  forbiddenResponse,
  idParamsSchema,
  internalServerErrorResponse,
  notFoundResponse,
} from "@/infrastructure/docs/endpoints/shared-docs";
import { registry } from "@/infrastructure/docs/registry";
import { CreateExpenseBodySchema } from "@/infrastructure/validation/zod/schemas/expense/create-expense-body-schema";
import { z } from "zod";

const ExpenseResponseSchema = z.object({
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
});

export function registerExpenseDocs() {
  registry.registerPath({
    method: "post",
    path: buildOpenApiPath(EXPENSE_ROUTES_PATH.root, EXPENSE_ROUTES_PATH.create),
    tags: ["Expenses"],
    summary: "Create one or more expense installments",
    request: {
      body: {
        required: true,
        content: {
          "application/json": {
            schema: CreateExpenseBodySchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Expense created successfully",
        content: {
          "application/json": {
            schema: z.array(ExpenseResponseSchema),
          },
        },
      },
      400: badRequestResponse,
      403: forbiddenResponse,
      500: internalServerErrorResponse,
    },
  });

  registry.registerPath({
    method: "delete",
    path: buildOpenApiPath(EXPENSE_ROUTES_PATH.root, EXPENSE_ROUTES_PATH.delete),
    tags: ["Expenses"],
    summary: "Delete an expense installment group by installment id",
    request: {
      params: idParamsSchema,
    },
    responses: {
      204: {
        description: "Expense deleted successfully",
      },
      400: badRequestResponse,
      403: forbiddenResponse,
      404: notFoundResponse,
    },
  });
}
