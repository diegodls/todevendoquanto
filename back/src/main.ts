import { errorHandlerAdapterExpress } from "./adapters/express/errorHandlerAdapterExpress";
import { httpAdapterExpress } from "./adapters/express/httpAdapterExpress";
import { ExpressApp } from "./app/express/ExpressApp";
import { testRoutes } from "./routes/test/testRoutes";
import { userRoutes } from "./routes/user/userRoutes";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = ExpressApp.build();

app.loadUserRoutes(userRoutes);
app.loadTestRoutes(testRoutes);

app.loadMiddleware(httpAdapterExpress(errorHandlerAdapterExpress));

app.start(PORT);
