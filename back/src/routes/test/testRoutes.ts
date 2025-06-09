import { TestController } from "../../controllers/express/test/TestController";
import { ITestController } from "../../controllers/interfaces/test/ITestController";
import { IRoute } from "../IRoute";

const testController = new TestController();

const testRoutes: IRoute<ITestController>[] = [
  {
    path: "/test",
    method: "get",
    handler: testController,
  },
];

export { testRoutes };
