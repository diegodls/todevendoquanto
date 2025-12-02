import { PublicRouteObjInterface } from "@/core/ports/infrastructure/http/routes/route-obj-interface";
import { UserLoginController } from "@/infrastructure/http/express/controllers/auth/login-controller";
import { CreateUserController } from "@/infrastructure/http/express/controllers/user/create-user-controller";

export type PublicRoutesType = [
  PublicRouteObjInterface<CreateUserController>,
  PublicRouteObjInterface<UserLoginController>
];
