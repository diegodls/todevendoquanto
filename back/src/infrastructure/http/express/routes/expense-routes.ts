import { EXPENSE_ROUTES_PATH } from "@/core/ports/infrastructure/http/app-routes-paths";
import { CreateExpenseUseCase } from "@/core/usecases/expense/create-expense-usecase";
import { authenticatedExpressHttpAdapter } from "@/infrastructure/http/express/adapters/http-adapter-express";
import { CreateExpenseController } from "@/infrastructure/http/express/controllers/expense/create-expense-controller";
import { ensureIsAuthenticated } from "@/infrastructure/http/express/middleware/ensure-is-authenticated";
import { prisma } from "@/infrastructure/repositories/prisma/config/prisma-client";
import { ExpenseRepositoryPrisma } from "@/infrastructure/repositories/prisma/expense-repository-prisma";
import { Router } from "express";
import { JwtVerifyToken } from "../../../protocols/jwt/jwt-verify-token";

const jwtVerifyToken = new JwtVerifyToken();

const expenseRouter = Router();

const expenseRepository = new ExpenseRepositoryPrisma(prisma);

const createExpenseUseCase = new CreateExpenseUseCase(expenseRepository);

const createExpenseController = new CreateExpenseController(
  createExpenseUseCase
);

expenseRouter.use(ensureIsAuthenticated(jwtVerifyToken));

expenseRouter.post(
  EXPENSE_ROUTES_PATH.create,
  authenticatedExpressHttpAdapter(createExpenseController)
);

export { expenseRouter };
