import { ErrorUseCase } from "@/core/usecases/api/error-usecase";
import { JwtVerifyToken } from "@/infrastructure/auth/jwt-verify-token";
import { authenticatedExpressHttpAdapter } from "@/infrastructure/http/express/adapters/http-adapter-express";
import { ErrorController } from "@/infrastructure/http/express/controllers/api/error-controller";
import { TestController } from "@/infrastructure/http/express/controllers/api/test-controller";
import { ensureIsAdmin } from "@/infrastructure/http/express/middleware/ensure-is-admin";
import { ensureIsAuthenticated } from "@/infrastructure/http/express/middleware/ensure-is-authenticated";
import { Router } from "express";

const testController = new TestController();

const errorService = new ErrorUseCase();
const errorController = new ErrorController(errorService);

const jwtService = new JwtVerifyToken();

const apiRouter = Router();

apiRouter.use(ensureIsAuthenticated(jwtService), ensureIsAdmin());

apiRouter.get("/test", authenticatedExpressHttpAdapter(testController));

apiRouter.get("/error", authenticatedExpressHttpAdapter(errorController));

export { apiRouter };
