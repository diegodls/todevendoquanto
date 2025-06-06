import { UserController } from "../controllers/express/user/CreateUserController";
import { IUserRoutes } from "../routes/user/userRoutes";

export interface IApp {
  start(PORT: number): void;
  loadUserRoutes(userRoutes: IUserRoutes<UserController>[]): void;
}
