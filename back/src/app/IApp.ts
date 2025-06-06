import { UserController } from "../controllers/express/user/CreateUserController";
import { ITestRoutes } from "../routes/test/testRoutes";
import { IUserRoutes } from "../routes/user/userRoutes";

export interface IApp {
  start(PORT: number): void;
  loadUserRoutes(userRoutes: IUserRoutes<UserController>[]): void;
  loadTestRoutes(testRoutes: ITestRoutes<Function>[]): void;
}
