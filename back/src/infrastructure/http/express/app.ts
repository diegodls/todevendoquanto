import { AppInterface } from "@/core/ports/infrastructure/http/app-interface";
import express, {
  ErrorRequestHandler,
  Express,
  RequestHandler,
  Router,
} from "express";
import listEndpoints from "express-list-endpoints";

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

  public start(PORT: number): void {
    this.app.listen(PORT, () => {
      console.log("");
      console.log("");
      console.log(`🚀🚀🚀 SERVER RUNNING ON PORT: ${PORT}`);
      console.log("");
      console.log("");
    });

    this.printRoutes();
  }

  public printRoutes() {
    const routes = listEndpoints(this.app.router);

    console.log("");
    console.log("⚠️⚠️⚠️⚠️⚠️");
    console.log("");
    console.log(`🛣️ STACK: ${this.app.router.stack.length}`);
    console.log(`🛣️ ROTAS: ${routes.length}`);
    console.log("");
    console.table(routes);
  }
}
