import { USER_ROUTES_PATH } from "@/core/ports/infrastructure/http/app-routes-paths";
import { CreateUserUseCase } from "@/core/usecases/user/create-user-usecase";
import { DeleteUserUseCase } from "@/core/usecases/user/delete-user-usecase";
import { ListUsersUseCase } from "@/core/usecases/user/list-users-usecase";
import { UpdateUserUseCase } from "@/core/usecases/user/update-user-usecase";
import { authenticatedExpressHttpAdapter } from "@/infrastructure/http/express/adapters/http-adapter-express";
import { CreateUserController } from "@/infrastructure/http/express/controllers/user/create-user-controller";
import { DeleteUserByIDController } from "@/infrastructure/http/express/controllers/user/delete-user-by-id-controller";
import { ListUserController } from "@/infrastructure/http/express/controllers/user/list-user-controller";
import { UserUpdateController } from "@/infrastructure/http/express/controllers/user/update-user-controller";
import { ensureIsAdmin } from "@/infrastructure/http/express/middleware/ensure-is-admin";
import { ensureIsAuthenticated } from "@/infrastructure/http/express/middleware/ensure-is-authenticated";
import { Encrypt } from "@/infrastructure/protocols/encryption/encrypt";
import { JwtVerifyToken } from "@/infrastructure/protocols/jwt/jwt-verify-token";
import { prisma } from "@/infrastructure/repositories/prisma/config/prisma-client";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/prisma/user-repository-prisma";
import { Router } from "express";

const jwtVerifyToken = new JwtVerifyToken();

const encrypt = new Encrypt();

const userRepository = new UserRepositoryPrisma(prisma);

const createUserUseCase = new CreateUserUseCase(userRepository, encrypt);
const createUserController = new CreateUserController(createUserUseCase);

const listUsersUseCase = new ListUsersUseCase(userRepository);
const listUserController = new ListUserController(listUsersUseCase);

const deleteUseCase = new DeleteUserUseCase(userRepository);
const deleteController = new DeleteUserByIDController(deleteUseCase);

const updateUseCase = new UpdateUserUseCase(userRepository);
const updateController = new UserUpdateController(updateUseCase);

const usersRouter = Router();

const authenticatedUserRouter = Router();
authenticatedUserRouter.use(ensureIsAuthenticated(jwtVerifyToken));

authenticatedUserRouter.patch(
  USER_ROUTES_PATH.update,
  ensureIsAuthenticated(jwtVerifyToken),
  authenticatedExpressHttpAdapter(updateController),
);

const adminUserRouter = Router();
adminUserRouter.use(ensureIsAuthenticated(jwtVerifyToken), ensureIsAdmin());

adminUserRouter.get(
  USER_ROUTES_PATH.list,
  authenticatedExpressHttpAdapter(listUserController),
);

adminUserRouter.post(
  USER_ROUTES_PATH.create,
  authenticatedExpressHttpAdapter(createUserController),
);

adminUserRouter.delete(
  USER_ROUTES_PATH.delete,
  authenticatedExpressHttpAdapter(deleteController),
);

usersRouter.use(authenticatedUserRouter);
usersRouter.use(adminUserRouter);

export { usersRouter };
