import { IPublicRouteOBJ } from "@/core/ports/infrastructure/http/routes/IRouteOBJ";
import { UserLoginController } from "@/infrastructure/http/express/controllers/public/user/UserLoginController";
import { UserSignInController } from "@/infrastructure/http/express/controllers/public/user/UserSignInController";

export type IPublicRoutes = [
  IPublicRouteOBJ<UserSignInController>,
  IPublicRouteOBJ<UserLoginController>
];
