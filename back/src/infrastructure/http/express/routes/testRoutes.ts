import { ErrorService } from "@/application/services/error/errorService";
import { ITestRoutes } from "@/core/ports/infrastructure/http/routes/ITestRoutes";
import { ErrorController } from "@/infrastructure/http/express/controllers/error/ErrorController";
import { TestController } from "@/infrastructure/http/express/controllers/test/TestController";

const testController = new TestController();
const errorService = new ErrorService();
const errorController = new ErrorController(errorService);

const testRoutes: ITestRoutes = [
  {
    path: "/test",
    method: "get",
    handler: testController,
  },
  {
    path: "/error",
    method: "get",
    handler: errorController,
  },
];

export { testRoutes };
