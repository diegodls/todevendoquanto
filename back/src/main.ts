import { testDb } from "@/core/shared/utils/db-health";
import { errorHandlerAdapterExpress } from "@/infrastructure/http/express/adapters/error-handler-adapter-express";
import { ExpressApp } from "@/infrastructure/http/express/app";
import { routesHub } from "@/infrastructure/http/express/routes/routes";

testDb();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = ExpressApp.build();

app.loadRoutes(routesHub);

app.loadMiddleware(errorHandlerAdapterExpress);

app.start(PORT);
