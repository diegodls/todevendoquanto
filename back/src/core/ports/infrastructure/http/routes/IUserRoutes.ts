import { IRouteOBJ } from "@/core/ports/infrastructure/http/routes/IRouteOBJ";
import { CreateUserController } from "@/infrastructure/http/express/controllers/user/CreateUserController";
import { UserLoginController } from "@/infrastructure/http/express/controllers/user/UserLoginController";

type IUserRoutes = [
  IRouteOBJ<CreateUserController>,
  IRouteOBJ<UserLoginController>
];

export { IUserRoutes };
