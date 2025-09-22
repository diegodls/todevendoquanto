import { UserService } from "@/application/services/user/userService";
import { IUserRoutes } from "@/core/ports/infrastructure/http/routes/IUserRoutes";
import { prisma } from "@/core/shared/utils/orm/prisma/prismaClient";
import { UserProfileUpdateController } from "@/infrastructure/http/express/controllers/authenticated/user/UserProfileUpdateController";
import { UserLoginController } from "@/infrastructure/http/express/controllers/user/UserLoginController";
import { UserSignInController } from "@/infrastructure/http/express/controllers/user/UserSignInController";

import { UserRepositoryPrisma } from "@/infrastructure/repositories/prisma/UserRepositoryPrisma";

const userRepository = new UserRepositoryPrisma(prisma);
const userService = new UserService(userRepository);
const signInUserController = new UserSignInController(userService);
const loginUserController = new UserLoginController(userService);
const updateProfileController = new UserProfileUpdateController();

const userRoutes: IUserRoutes = [
  { method: "post", path: "/user/signin", controller: signInUserController },
  { method: "post", path: "/user/login", controller: loginUserController },
  {
    method: "patch",
    path: "/user/login/update",
    controller: updateProfileController,
  },
];

export { userRoutes };
