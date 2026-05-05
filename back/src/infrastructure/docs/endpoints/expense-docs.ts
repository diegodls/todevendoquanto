import { EXPENSE_ROUTES_PATH } from "@/core/ports/infrastructure/http/app-routes-paths";
import {
  badRequestResponse,
  buildOpenApiPath,
  forbiddenResponse,
  internalServerErrorResponse,
  notFoundResponse,
} from "@/infrastructure/docs/endpoints/shared-docs";
import { registry } from "@/infrastructure/docs/registry";
import { CreateExpenseBodySchema } from "@/infrastructure/validation/zod/schemas/expense/create-expense-body-schema";
import { DeleteExpenseByIdSchema } from "@/infrastructure/validation/zod/schemas/expense/delete-expense-by-id-schema";
import { CreateExpenseResponseSchema } from "@/infrastructure/validation/zod/schemas/expense/create-expense-response-schema";

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
            schema: CreateExpenseResponseSchema.array(),
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
      params: DeleteExpenseByIdSchema,
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
