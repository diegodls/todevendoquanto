
import { IApp } from '@/core/ports/infrastructure/http/IApp';
import { IAdminRoutes } from '@/core/ports/infrastructure/http/routes/IAdminRoutes';
import { ITestRoutes } from '@/core/ports/infrastructure/http/routes/ITestRoutes';
import { IUserRoutes } from '@/core/ports/infrastructure/http/routes/IUserRoutes';
import { HttpMethod } from "@/core/shared/types/HttpMethod";
import { httpAdapterExpress } from "@/infrastructure/http/express/adapters/httpAdapterExpress";
import express, { ErrorRequestHandler, Express, RequestHandler } from "express";

type ExpressHttpMethod = keyof Pick<Express, HttpMethod>;

type Middleware = RequestHandler | ErrorRequestHandler;

export class ExpressApp implements IApp {
  private constructor(readonly app: Express) {}

  private registerRoute(
    app: Express,
    method: ExpressHttpMethod,
    path: string,
    handlers: RequestHandler[]
  ) {
    return app[method](path, ...handlers);
  }

  public loadAdminRoutes(adminRoutes: IAdminRoutes): void {
    adminRoutes.forEach((route) => {
      this.registerRoute(this.app, route.method, route.path, [
        httpAdapterExpress(route.handler),
      ]);
    });
  }

  public loadUserRoutes(userRoutes: IUserRoutes) {
    userRoutes.forEach((route) => {
      this.registerRoute(this.app, route.method, route.path, [
        httpAdapterExpress(route.handler),
      ]);
    });
  }

  public loadTestRoutes(testRoutes: ITestRoutes): void {
    testRoutes.forEach((route) => {
      this.registerRoute(this.app, route.method, route.path, [
        httpAdapterExpress(route.handler),
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
