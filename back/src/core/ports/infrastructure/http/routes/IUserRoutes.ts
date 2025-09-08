import { IRouteOBJ } from "@/core/ports/infrastructure/http/routes/IRouteOBJ";
import { UserLoginController } from "@/infrastructure/http/express/controllers/user/UserLoginController";
import { UserSignInController } from "@/infrastructure/http/express/controllers/user/UserSignInController";

type IUserRoutes = [
  IRouteOBJ<UserSignInController>,
  IRouteOBJ<UserLoginController>
];

export { IUserRoutes };
