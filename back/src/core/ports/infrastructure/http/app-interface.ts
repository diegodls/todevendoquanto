import { AuthenticatedRoutesTypes } from "@/core/ports/infrastructure/http/routes/authenticated-routes-type";
import { PublicRoutesType } from "@/core/ports/infrastructure/http/routes/public-routes-type";
import { TestRoutesType } from "@/core/ports/infrastructure/http/routes/test-routes-type";

export interface AppInterface {
  start(PORT: number): void;
  loadAuthenticatedRoutes(authenticatedRoutes: AuthenticatedRoutesTypes): void;
  loadPublicRoutes(publicRoutes: PublicRoutesType): void;
  loadTestRoutes(testRoutes: TestRoutesType): void;
}
