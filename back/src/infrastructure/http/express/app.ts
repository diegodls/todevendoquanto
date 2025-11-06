import { AppInterface } from "@/core/ports/infrastructure/http/app-interface";
import { AnyAuthenticatedRouteType } from "@/core/ports/infrastructure/http/routes/authenticated-routes-type";
import { PublicRoutesType } from "@/core/ports/infrastructure/http/routes/public-routes-type";
import { TestRoutesType } from "@/core/ports/infrastructure/http/routes/test-routes-type";
import { HttpMethod } from "@/core/shared/types/http-method";
import {
  authenticatedHttpAdapterExpress,
  publicHttpAdapterExpress,
} from "@/infrastructure/http/express/adapters/http-adapter-express";
import express, { ErrorRequestHandler, Express, RequestHandler } from "express";

type ExpressHttpMethod = keyof Pick<Express, HttpMethod>;

type Middleware = RequestHandler | ErrorRequestHandler;

export class ExpressApp implements AppInterface {
  private constructor(readonly app: Express) {}

  private registerRoute(
    app: Express,
    method: ExpressHttpMethod,
    path: string,
    handlers: RequestHandler[]
  ) {
    return app[method](path, ...handlers);
  }

  public loadAuthenticatedRoutes(
    authenticatedRoutes: AnyAuthenticatedRouteType[]
  ): void {
    authenticatedRoutes.forEach((route) => {
      this.registerRoute(this.app, route.method, route.path, [
        authenticatedHttpAdapterExpress(route.controller),
      ]);
    });
  }

  public loadPublicRoutes(publicRoutes: PublicRoutesType) {
    publicRoutes.forEach((route) => {
      this.registerRoute(this.app, route.method, route.path, [
        publicHttpAdapterExpress(route.controller),
      ]);
    });
  }

  public loadTestRoutes(testRoutes: TestRoutesType): void {
    testRoutes.forEach((route) => {
      this.registerRoute(this.app, route.method, route.path, [
        publicHttpAdapterExpress(route.controller),
      ]);
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
