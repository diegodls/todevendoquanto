import { CreateUserController } from "../../controllers/express/user/CreateUserController";
import { UserLoginController } from "../../controllers/express/user/UserLoginController";
import { UserRepositoryPrisma } from "../../repositories/prisma/UserRepositoryPrisma";
import { UserService } from "../../services/user/userService";
import { prisma } from "../../utils/orm/prisma/prismaClient";
import { IUserRoutes } from "./IUserRoutes";

const userRepository = new UserRepositoryPrisma(prisma);
const userService = new UserService(userRepository);
const createUserController = new CreateUserController(userService);
const loginUserController = new UserLoginController(userService);

const userRoutes: IUserRoutes = [
  { method: "post", path: "/users/create", handler: createUserController },
  { method: "post", path: "/users/login", handler: loginUserController },
];

export { userRoutes };
