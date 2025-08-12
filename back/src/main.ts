//import { testDb } from "@/core/shared/utils/dbHealth";
import { ExpressApp } from "@/infrastructure/http/express/app";
import { testRoutes } from "@/infrastructure/http/express/routes/testRoutes";
import { userRoutes } from "@/infrastructure/http/express/routes/userRoutes";
import { testDb } from "./core/shared/utils/dbHealth";
import { errorHandlerAdapterExpress } from "./infrastructure/http/express/adapters/errorHandlerAdapterExpress";
import { adminRoutes } from "./infrastructure/http/express/routes/adminRoutes";

testDb();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = ExpressApp.build();

app.loadUserRoutes(userRoutes);

app.loadTestRoutes(testRoutes);

app.loadAdminRoutes(adminRoutes);

app.loadMiddleware(errorHandlerAdapterExpress);

app.start(PORT);
