import { ExpressApp } from "./app/express/ExpressApp";
import { userRouters } from "./routes/user/userRoutes";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = ExpressApp.build();

app.loadUserRoutes(userRouters);

app.start(PORT);
