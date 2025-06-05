import { Express, RequestHandler } from "express";
import { expressAdapter } from "../../../adapters/express/expressAdapter";
import { userRouters } from "../../../routes/user/userRoutes";

type HttpMethod = keyof Pick<
  Express,
  "get" | "post" | "put" | "delete" | "patch"
>;

const registerRoute = (
  app: Express,
  method: HttpMethod,
  path: string,
  ...handlers: RequestHandler[]
) => {
  app[method](path, ...handlers);
};

const loadRoutesExpress = (app: Express) => {
  const allRoutes = [...userRouters];

  allRoutes.forEach((route) => {
    registerRoute(
      app,
      route.method,
      route.path,
      expressAdapter(route.controller)
    );
  });
};
// ! IRouter.post: IRouterMatcher<Express, "post">
export { loadRoutesExpress };
