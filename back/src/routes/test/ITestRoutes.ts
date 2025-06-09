import { TestController } from "../../controllers/express/test/TestController";
import { IRoute } from "../IRoute";

type ITestRoutes = [IRoute<TestController>, IRoute<TestController>];

export { ITestRoutes };
