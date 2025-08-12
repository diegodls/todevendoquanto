import { IAdminRoutes } from "@/core/ports/infrastructure/http/routes/IAdminRoutes";
import { ITestRoutes } from "@/core/ports/infrastructure/http/routes/ITestRoutes";
import { IUserRoutes } from "@/core/ports/infrastructure/http/routes/IUserRoutes";

export interface IApp {
  start(PORT: number): void;
  loadUserRoutes(userRoutes: IUserRoutes): void;
  loadTestRoutes(testRoutes: ITestRoutes): void;
  loadAdminRoutes(adminRoutes: IAdminRoutes): void;
  // TODO: Maybe split routes in "Load Public/Authenticated Routes"
}
