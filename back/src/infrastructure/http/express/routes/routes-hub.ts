import { apiRouter } from "@/infrastructure/http/express/routes/api-routes";
import { usersRouter } from "@/infrastructure/http/express/routes/user-routes";
import { Router } from "express";

const routesHub = Router();

routesHub.use("/api", apiRouter);
routesHub.use("/users", usersRouter);

export { routesHub };
