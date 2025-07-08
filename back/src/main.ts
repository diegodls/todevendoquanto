import { errorHandlerAdapterExpress } from "./adapters/express/errorHandlerAdapterExpress";
import { ExpressApp } from "./app/express/ExpressApp";
import { adminRoutes } from "./routes/admin/adminRoutes";
import { testRoutes } from "./routes/test/testRoutes";
import { userRoutes } from "./routes/user/userRoutes";
import { testDb } from "./utils/dbHealth";

testDb();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = ExpressApp.build();

app.loadUserRoutes(userRoutes);

app.loadTestRoutes(testRoutes);

app.loadAdminRoutes(adminRoutes);

app.loadMiddleware(errorHandlerAdapterExpress);

app.start(PORT);
