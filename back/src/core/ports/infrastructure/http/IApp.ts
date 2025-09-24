import { IAuthenticatedRoutes } from "@/core/ports/infrastructure/http/routes/IAuthenticatedRoutes";
import { IPublicRoutes } from "@/core/ports/infrastructure/http/routes/IPublicRoutes";
import { ITestRoutes } from "@/core/ports/infrastructure/http/routes/ITestRoutes";

export interface IApp {
  start(PORT: number): void;
  loadAuthenticatedRoutes(authenticatedRoutes: IAuthenticatedRoutes): void;
  loadPublicRoutes(publicRoutes: IPublicRoutes): void;
  loadTestRoutes(testRoutes: ITestRoutes): void;
}
