import { IAdminRoutes } from "../routes/admin/IAdminRoutes";
import { ITestRoutes } from "../routes/test/ITestRoutes";
import { IUserRoutes } from "../routes/user/IUserRoutes";

export interface IApp {
  start(PORT: number): void;
  loadUserRoutes(userRoutes: IUserRoutes): void;
  loadTestRoutes(testRoutes: ITestRoutes): void;
  loadAdminRoutes(adminRoutes: IAdminRoutes): void;
}
