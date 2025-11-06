import { PublicRouteObjInterface } from "@/core/ports/infrastructure/http/routes/route-obj-interface";
import { ErrorController } from "@/infrastructure/http/express/controllers/error/error-controller";
import { TestController } from "@/infrastructure/http/express/controllers/test/test-controller";

export type TestRoutesType = [
  PublicRouteObjInterface<TestController>,
  PublicRouteObjInterface<ErrorController>
];
