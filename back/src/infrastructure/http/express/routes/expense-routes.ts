import { EXPENSE_ROUTES_PATH } from "@/core/ports/infrastructure/http/app-routes-paths";
import { CreateExpenseUseCase } from "@/core/usecases/expense/create-expense-usecase";
import { DeleteExpenseUseCase } from "@/core/usecases/expense/delete-expense-usecase";
import { authenticatedExpressHttpAdapter } from "@/infrastructure/http/express/adapters/http-adapter-express";
import { CreateExpenseController } from "@/infrastructure/http/express/controllers/expense/create-expense-controller";
import { DeleteExpenseController } from "@/infrastructure/http/express/controllers/expense/delete-expense-controller";
import { ensureIsAuthenticated } from "@/infrastructure/http/express/middleware/ensure-is-authenticated";
import { GenerateUuid } from "@/infrastructure/protocols/uuid/generate-uuid";
import { prisma } from "@/infrastructure/repositories/prisma/config/prisma-client";
import { ExpenseRepositoryPrisma } from "@/infrastructure/repositories/prisma/expense-repository-prisma";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/prisma/user-repository-prisma";
import { Router } from "express";
import { JwtVerifyToken } from "../../../protocols/jwt/jwt-verify-token";

const jwtVerifyToken = new JwtVerifyToken();

const generateUuid = new GenerateUuid();

const expenseRouter = Router();

const userRepository = new UserRepositoryPrisma(prisma);

const expenseRepository = new ExpenseRepositoryPrisma(prisma);

const createExpenseUseCase = new CreateExpenseUseCase(
  expenseRepository,
  generateUuid
);

const createExpenseController = new CreateExpenseController(
  createExpenseUseCase
);

const deleteExpenseUseCase = new DeleteExpenseUseCase(
  expenseRepository,
  userRepository
);

const deleteExpenseController = new DeleteExpenseController(
  deleteExpenseUseCase
);

expenseRouter.use(ensureIsAuthenticated(jwtVerifyToken));

expenseRouter.post(
  EXPENSE_ROUTES_PATH.create,
  authenticatedExpressHttpAdapter(createExpenseController)
);

expenseRouter.delete(
  EXPENSE_ROUTES_PATH.delete,
  authenticatedExpressHttpAdapter(deleteExpenseController)
);

export { expenseRouter };
