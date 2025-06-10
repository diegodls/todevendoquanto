import { ErrorController } from "../../controllers/express/error/ErrorController";
import { TestController } from "../../controllers/express/test/TestController";
import { IRoute } from "../IRoute";

type ITestRoutes = [IRoute<TestController>, IRoute<ErrorController>];

export { ITestRoutes };
