import { AppInterface } from "@/core/ports/infrastructure/http/app-interface";
import { HttpMethod } from "@/core/shared/types/http-method";
import express, {
  ErrorRequestHandler,
  Express,
  RequestHandler,
  Router,
} from "express";

type ExpressHttpMethod = keyof Pick<Express, HttpMethod>;

type Middleware = RequestHandler | ErrorRequestHandler;

export class ExpressApp implements AppInterface {
  private constructor(readonly app: Express) {}

  public loadRoutes(routes: Router): void {
    this.app.use("/api/v1", routes);
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
    console.log("");
    console.log("⚠️⚠️⚠️⚠️⚠️");
    console.log("");
    console.log(`🛣️ ROTAS: ${this.app.router.stack.length}`);
    console.log("");
    console.log(this.app.router.stack[1].handle);
    console.log("");
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
