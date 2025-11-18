import { PublicRouteObjInterface } from "@/core/ports/infrastructure/http/routes/route-obj-interface";
import { ErrorController } from "@/infrastructure/http/express/controllers/tests/error-controller";
import { TestController } from "@/infrastructure/http/express/controllers/tests/test-controller";

export type TestRoutesType = [
  PublicRouteObjInterface<TestController>,
  PublicRouteObjInterface<ErrorController>
];
