import { ErrorController } from "../../controllers/express/error/ErrorController";
import { TestController } from "../../controllers/express/test/TestController";
import { ErrorService } from "../../services/error/errorService";
import { ITestRoutes } from "./ITestRoutes";

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
