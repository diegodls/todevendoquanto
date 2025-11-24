import { ErrorService } from "@/core/usecases/api/error-usecase";
import { JWTAuth } from "@/infrastructure/auth/jwt-auth";
import { publicHttpAdapterExpress } from "@/infrastructure/http/express/adapters/http-adapter-express";
import { ErrorController } from "@/infrastructure/http/express/controllers/api/error-controller";
import { TestController } from "@/infrastructure/http/express/controllers/api/test-controller";
import { ensureIsAdmin } from "@/infrastructure/http/express/middleware/ensure-is-admin";
import { ensureAuthenticated } from "@/infrastructure/http/express/middleware/ensure-is-authenticated";
import { Router } from "express";

const testController = new TestController();
const errorService = new ErrorService();
const errorController = new ErrorController(errorService);

const jwtService = new JWTAuth();

const apiRouter = Router();

apiRouter.use(ensureAuthenticated(jwtService), ensureIsAdmin());

apiRouter.get("/test", publicHttpAdapterExpress(testController));

apiRouter.get("/error", publicHttpAdapterExpress(errorController));

export { apiRouter };
