import { UserController } from "../../controllers/express/user/CreateUserController";
import { UserRepositoryPrisma } from "../../repositories/prisma/UserRepositoryPrisma";
import { UserService } from "../../services/userService";
import { HttpMethod } from "../../types/HttpMethod";
import { prisma } from "../../utils/orm/prisma/prismaClient";

const userRepository = new UserRepositoryPrisma(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);
interface IUserRoutes<T> {
  method: HttpMethod;
  path: string;
  handler: T;
}

const userRoutes: IUserRoutes<UserController>[] = [
  { method: "post", path: "/users/create", handler: userController },
];

export { IUserRoutes, userRoutes };
