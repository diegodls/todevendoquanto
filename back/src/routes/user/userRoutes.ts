import { CreateUserController } from "../../controllers/express/user/CreateUserController";
import { UserRepositoryPrisma } from "../../repositories/prisma/UserRepositoryPrisma";
import { UserService } from "../../services/user/userService";
import { prisma } from "../../utils/orm/prisma/prismaClient";
import { IRoute } from "../IRoute";

const userRepository = new UserRepositoryPrisma(prisma);
const userService = new UserService(userRepository);
const userController = new CreateUserController(userService);

const userRoutes: IRoute<CreateUserController>[] = [
  { method: "post", path: "/users/create", handler: userController },
  { method: "get", path: "/users/login", handler: userController },
];

export { userRoutes };
