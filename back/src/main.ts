//import { testDb } from "@/core/shared/utils/dbHealth";

import { testDb } from "@/core/shared/utils/db-health";
import { errorHandlerAdapterExpress } from "@/infrastructure/http/express/adapters/error-handler-adapter-express";
import { ExpressApp } from "@/infrastructure/http/express/app";
import { authenticatedRoutes } from "@/infrastructure/http/express/routes/old/authenticated-routes";
import { publicRoutes } from "@/infrastructure/http/express/routes/old/public-routes";
import { testRoutes } from "@/infrastructure/http/express/routes/old/test-routes";

testDb();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = ExpressApp.build();

app.loadAuthenticatedRoutes(authenticatedRoutes);

app.loadPublicRoutes(publicRoutes);

app.loadTestRoutes(testRoutes);

app.loadMiddleware(errorHandlerAdapterExpress);

app.start(PORT);
