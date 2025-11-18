import { PublicRouteObjInterface } from "@/core/ports/infrastructure/http/routes/route-obj-interface";
import { CreateUserController } from "@/infrastructure/http/express/controllers/user/create-controller";
import { UserLoginController } from "@/infrastructure/http/express/controllers/user/login-controller";

export type PublicRoutesType = [
  PublicRouteObjInterface<CreateUserController>,
  PublicRouteObjInterface<UserLoginController>
];
