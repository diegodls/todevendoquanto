import { UserService } from "@/application/services/user-service";
import { PublicRoutesType } from "@/core/ports/infrastructure/http/routes/public-routes-type";
import { prisma } from "@/core/shared/utils/orm/prisma/prisma-client";
import { UserLoginController } from "@/infrastructure/http/express/controllers/public/user/user-login-controller";
import { UserSignInController } from "@/infrastructure/http/express/controllers/public/user/user-sign-in-controller";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/prisma/user-repository-prisma";

const userRepository = new UserRepositoryPrisma(prisma);
const userService = new UserService(userRepository);
const signInUserController = new UserSignInController(userService);
const loginUserController = new UserLoginController(userService);

export const publicRoutes: PublicRoutesType = [
  { method: "post", path: "/user/signin", controller: signInUserController },
  { method: "post", path: "/user/login", controller: loginUserController },
];
