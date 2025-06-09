import express, { Express, RequestHandler } from "express";
import { expressControllerAdapter } from "../../adapters/express/expressControllerAdapter";
import { TestController } from "../../controllers/express/test/TestController";
import { UserController } from "../../controllers/express/user/CreateUserController";
import { IRoute } from "../../routes/IRoute";
import { HttpMethod } from "../../types/HttpMethod";
import { IApp } from "../IApp";

type ExpressHttpMethod = keyof Pick<Express, HttpMethod>;

export class ExpressApp implements IApp {
  private constructor(readonly app: Express) {}

  private genericHandler(path: string): RequestHandler {
    // ! MOVER ESSE GENERIC LÁ PRA FUNÇÃO DO ADAPTER_EXPRESS
    return () => {
      console.log("🔴⚠️GENERIC METHOD - NOT IMPLEMENTED⚠️🔴");
      console.log(path);
    };
  }

  private registerRoute(
    app: Express,
    method: ExpressHttpMethod,
    path: string,
    ...handlers: RequestHandler[]
  ) {
    return app[method](path, handlers);
  }

  public loadUserRoutes(allRoutes: IRoute<UserController>[]) {
    allRoutes.forEach((route) => {
      this.registerRoute(
        this.app,
        route.method,
        route.path,
        expressControllerAdapter(route.handler)
      );
    });
  }

  public loadTestRoutes(testRoutes: IRoute<TestController>[]): void {
    testRoutes.forEach((route) => {
      this.registerRoute(
        this.app,
        route.method,
        route.path,
        expressControllerAdapter(route.handler)
      );
    });
  }

  public static build() {
    const app = express();

    //app.use(errorMiddleware);

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
