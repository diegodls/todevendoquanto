import { UserService } from "@/application/services/user/userService";
import { IUserRoutes } from "@/core/ports/infrastructure/http/routes/IUserRoutes";
import { prisma } from "@/core/shared/utils/orm/prisma/prismaClient";
import { CreateUserController } from "@/infrastructure/http/express/controllers/user/CreateUserController";
import { UserLoginController } from "@/infrastructure/http/express/controllers/user/UserLoginController";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/prisma/UserRepositoryPrisma";

const userRepository = new UserRepositoryPrisma(prisma);
const userService = new UserService(userRepository);
const createUserController = new CreateUserController(userService);
const loginUserController = new UserLoginController(userService);

const userRoutes: IUserRoutes = [
  { method: "post", path: "/users/create", handler: createUserController },
  { method: "post", path: "/users/login", handler: loginUserController },
];

export { userRoutes };
