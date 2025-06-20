import express, { ErrorRequestHandler, Express, RequestHandler } from "express";
import { httpAdapterExpress } from "../../adapters/express/httpAdapterExpress";
import { ITestRoutes } from "../../routes/test/ITestRoutes";
import { IUserRoutes } from "../../routes/user/IUserRoutes";
import { HttpMethod } from "../../types/HttpMethod";
import { IApp } from "../IApp";

type ExpressHttpMethod = keyof Pick<Express, HttpMethod>;

type Middleware = RequestHandler | ErrorRequestHandler;

export class ExpressApp implements IApp {
  private constructor(readonly app: Express) {}

  private registerRoute(
    app: Express,
    method: ExpressHttpMethod,
    path: string,
    ...handlers: RequestHandler[]
  ) {
    return app[method](path, handlers);
  }

  public loadUserRoutes(userRoutes: IUserRoutes) {
    userRoutes.forEach((route) => {
      this.registerRoute(
        this.app,
        route.method,
        route.path,
        httpAdapterExpress(route.handler)
      );
    });
  }

  public loadTestRoutes(testRoutes: ITestRoutes): void {
    testRoutes.forEach((route) => {
      this.registerRoute(
        this.app,
        route.method,
        route.path,
        httpAdapterExpress(route.handler)
      );
    });
  }

  public loadMiddleware(middleware: Middleware): void {
    this.app.use(middleware);
  }

  public static build() {
    const app = express();

    app.use(express.json());

    return new ExpressApp(app);
  }

  private printRoutes() {
    const routes = this.app.router.stack
      .filter((layer: any) => layer.route)
      .map((route: any) => {
        return {
          path: route.route.path,
          method: route.route.stack[0].method,
        };
      });

    console.table(routes);
  }

  public start(PORT: number): void {
    this.app.listen(PORT, () => {
      console.log("");
      console.log("");
      console.log(`🚀🚀🚀 SERVER RUNNING ON PORT: ${PORT}`);
      this.printRoutes();
      console.log("");
      console.log("");
    });
  }
}
