import { prisma } from "@/core/shared/utils/orm/prisma/prisma-client";
import { CreateUserUseCase } from "@/core/usecases/user/create-user-usecase";
import { CreateUserController } from "@/infrastructure/http/express/controllers/user/create-controller";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/prisma/user-repository-prisma";
import { Router } from "express";

const userRepository = new UserRepositoryPrisma(prisma);

const createUserUseCase = new CreateUserUseCase(userRepository);

const createUserController = new CreateUserController(createUserUseCase);

export const usersRouter = Router();

usersRouter.post("/create", createUserController.handle);

PAREI AQUI, TEM QUE FAZER O OU ALTERAR O ADAPTER
