import { TestController } from "../../controllers/express/test/TestController";
import { ITestRoutes } from "./ITestRoutes";

const testController = new TestController();

const testRoutes: ITestRoutes = [
  {
    path: "/test",
    method: "get",
    handler: testController,
  },
  {
    path: "/error",
    method: "get",
    handler: testController,
  },
];

export { testRoutes };
