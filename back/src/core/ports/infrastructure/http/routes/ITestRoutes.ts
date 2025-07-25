import { IRouteOBJ } from "@/core/ports/infrastructure/http/routes/IRouteOBJ";
import { ErrorController } from "@/infrastructure/http/express/controllers/error/ErrorController";
import { TestController } from "@/infrastructure/http/express/controllers/test/TestController";

type ITestRoutes = [IRouteOBJ<TestController>, IRouteOBJ<ErrorController>];

export { ITestRoutes };
