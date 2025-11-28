import { apiRouter } from "@/infrastructure/http/express/routes/api-routes";
import { authRouter } from "@/infrastructure/http/express/routes/auth-routes";
import { usersRouter } from "@/infrastructure/http/express/routes/user-routes";
import { Router } from "express";

const routesHub = Router();

routesHub.use("", authRouter);
routesHub.use("/api", apiRouter);
routesHub.use("/users", usersRouter);

export { routesHub };
