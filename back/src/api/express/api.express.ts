import express, { Express, RequestHandler } from "express";
import { Api } from "../api";
import { errorMiddlewareExpress } from "./middleware/error/error.middleware.express";

export class ApiExpress implements Api {
  private constructor(readonly app: Express) {}

  public static build() {
    const app = express();

    app.use(express.json());

    return new ApiExpress(app);
  }

  public addGetRoute<Body = {}, Params = {}, Query = {}>(
    path: string,
    ...handler: Array<RequestHandler<Body, any, Params, Query>>
  ): void {
    this.app.get(path, ...handler);
  }

  public addPostRoute<Body = {}, Params = {}, Query = {}>(
    path: string,
    ...handler: Array<RequestHandler<Body, any, Params, Query>>
  ): void {
    this.app.post(path, ...handler);
  }

  public useErrorMiddleware() {
    this.app.use(errorMiddlewareExpress);
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

  public start(port: number) {
    this.app.listen(port, () => {
      console.log(`🚀🚀🚀 SERVER RUNNING ON PORT: ${port}`);
      console.log("");
      console.log(this.printRoutes());
    });
  }
}
