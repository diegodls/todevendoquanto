import { apiRouter } from "@/infrastructure/http/express/routes/api-routes";
import { usersRouter } from "@/infrastructure/http/express/routes/user-routes";
import { Router } from "express";

const routes = Router();

routes.use("/api", apiRouter);
routes.use("/users", usersRouter);

export { routes };
