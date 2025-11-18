import { TestRoutesType } from "@/core/ports/infrastructure/http/routes/test-routes-type";
import { ErrorService } from "@/core/usecases/tests/error-usecase";
import { ErrorController } from "@/infrastructure/http/express/controllers/tests/error-controller";
import { TestController } from "@/infrastructure/http/express/controllers/tests/test-controller";

const testController = new TestController();
const errorService = new ErrorService();
const errorController = new ErrorController(errorService);

export const testRoutes: TestRoutesType = [
  {
    path: "/test",
    method: "get",
    controller: testController,
  },
  {
    path: "/error",
    method: "get",
    controller: errorController,
  },
];
