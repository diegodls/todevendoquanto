import { IPublicRouteOBJ } from "@/core/ports/infrastructure/http/routes/IRouteOBJ";
import { ErrorController } from "@/infrastructure/http/express/controllers/error/ErrorController";
import { TestController } from "@/infrastructure/http/express/controllers/test/TestController";

export type ITestRoutes = [
  IPublicRouteOBJ<TestController>,
  IPublicRouteOBJ<ErrorController>
];
