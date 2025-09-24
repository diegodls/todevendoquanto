//import { testDb } from "@/core/shared/utils/dbHealth";
import { ExpressApp } from "@/infrastructure/http/express/app";
import { publicRoutes } from "@/infrastructure/http/express/routes/publicRoutes";
import { testRoutes } from "@/infrastructure/http/express/routes/testRoutes";
import { testDb } from "./core/shared/utils/dbHealth";
import { errorHandlerAdapterExpress } from "./infrastructure/http/express/adapters/errorHandlerAdapterExpress";
import { authenticatedRoutes } from "./infrastructure/http/express/routes/authenticatedRoutes";

testDb();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = ExpressApp.build();

app.loadAuthenticatedRoutes(authenticatedRoutes);

app.loadPublicRoutes(publicRoutes);

app.loadTestRoutes(testRoutes);

app.loadMiddleware(errorHandlerAdapterExpress);

app.start(PORT);
