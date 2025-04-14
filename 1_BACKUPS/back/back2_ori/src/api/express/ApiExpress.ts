import express, { Express, Request, Response } from "express";
import { Api } from "../api";

export class ApiExpress implements Api {
  private constructor(readonly app: Express) {}

  public static build() {
    const app = express();

    app.use(express.json());

    return new ApiExpress(app);
  }

  public addGetRoute(
    path: string,
    handle: (req: Request, res: Response) => Promise<void>
  ): void {
    this.app.get(path, handle);
  }

  public addPostRoute(
    path: string,
    handle: (req: Request, res: Response) => Promise<void>
  ): void {
    this.app.post(path, handle);
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
