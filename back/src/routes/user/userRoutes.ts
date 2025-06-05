import { UserController } from "../../controllers/express/user/CreateUserController";
import { UserRepositoryPrisma } from "../../repositories/prisma/UserRepositoryPrisma";
import { UserService } from "../../services/userService";
import { prisma } from "../../utils/orm/prisma/prismaClient";
import { IUserRoutes } from "./IUserRoutes";

const userRepository = new UserRepositoryPrisma(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const userRouters: IUserRoutes<UserController>[] = [
  { method: "post", path: "/users/create", controller: userController },
];

export { userRouters };
