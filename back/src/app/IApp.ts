import { UserController } from "../controllers/express/user/CreateUserController";
import { IRoute } from "../routes/IRoute";
import { ITestRoutes } from "../routes/test/ITestRoutes";

export interface IApp {
  start(PORT: number): void;
  loadUserRoutes(userRoutes: IRoute<UserController>[]): void;
  loadTestRoutes(testRoutes: ITestRoutes): void;
}
