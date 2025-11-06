import { PublicRouteObjInterface } from "@/core/ports/infrastructure/http/routes/route-obj-interface";
import { UserLoginController } from "@/infrastructure/http/express/controllers/public/user/user-login-controller";
import { UserSignInController } from "@/infrastructure/http/express/controllers/public/user/user-sign-in-controller";

export type PublicRoutesType = [
  PublicRouteObjInterface<UserSignInController>,
  PublicRouteObjInterface<UserLoginController>
];
