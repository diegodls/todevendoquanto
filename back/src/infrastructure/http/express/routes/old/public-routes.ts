import { PublicRoutesType } from "@/core/ports/infrastructure/http/routes/public-routes-type";
import { prisma } from "@/core/shared/utils/orm/prisma/prisma-client";
import { CreateUserUseCase } from "@/core/usecases/user/create-user-usecase";
import { LoginUseCase } from "@/core/usecases/user/login-usecase";
import { CreateUserController } from "@/infrastructure/http/express/controllers/user/create-controller";
import { UserLoginController } from "@/infrastructure/http/express/controllers/user/login-controller";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/prisma/user-repository-prisma";

const userRepository = new UserRepositoryPrisma(prisma);

const createUserUseCase = new CreateUserUseCase(userRepository);
const createUserController = new CreateUserController(createUserUseCase);

const loginUseCase = new LoginUseCase(userRepository);
const loginUserController = new UserLoginController(loginUseCase);

export const publicRoutes: PublicRoutesType = [
  { method: "post", path: "/signin", controller: createUserController },
  { method: "post", path: "/login", controller: loginUserController },
];
