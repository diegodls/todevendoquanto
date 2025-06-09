import { TestController } from "../controllers/express/test/TestController";
import { UserController } from "../controllers/express/user/CreateUserController";
import { IRoute } from "../routes/IRoute";

export interface IApp {
  start(PORT: number): void;
  loadUserRoutes(userRoutes: IRoute<UserController>[]): void;
  loadTestRoutes(testRoutes: IRoute<TestController>[]): void;
}
