import {
  API_ROUTES_PATH,
  AUTH_ROUTES_PATH,
  DOCS_ROUTES_PATH,
  EXPENSE_ROUTES_PATH,
  USER_ROUTES_PATH,
} from "@/core/ports/infrastructure/http/app-routes-paths";
import { apiRouter } from "@/infrastructure/http/express/routes/api-routes";
import { authRouter } from "@/infrastructure/http/express/routes/auth-routes";
import { docsRouter } from "@/infrastructure/http/express/routes/docs-routes";
import { expenseRouter } from "@/infrastructure/http/express/routes/expense-routes";
import { usersRouter } from "@/infrastructure/http/express/routes/user-routes";
import { Router } from "express";

const routesHub = Router();

routesHub.use(AUTH_ROUTES_PATH.root, authRouter);
routesHub.use(DOCS_ROUTES_PATH.root, docsRouter);
routesHub.use(API_ROUTES_PATH.root, apiRouter);
routesHub.use(USER_ROUTES_PATH.root, usersRouter);
routesHub.use(EXPENSE_ROUTES_PATH.root, expenseRouter);

export { routesHub };

// TODO: trocar os imports por index.ts
