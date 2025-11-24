import { PublicRouteObjInterface } from "@/core/ports/infrastructure/http/routes/route-obj-interface";
import { ErrorController } from "@/infrastructure/http/express/controllers/api/error-controller";
import { TestController } from "@/infrastructure/http/express/controllers/api/test-controller";

export type TestRoutesType = [
  PublicRouteObjInterface<TestController>,
  PublicRouteObjInterface<ErrorController>
];
