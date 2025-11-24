import { prisma } from "@/core/shared/utils/orm/prisma/prisma-client";
import { CreateUserUseCase } from "@/core/usecases/user/create-user-usecase";
import { DeleteUserUseCase } from "@/core/usecases/user/delete-user-usecase";
import { ListUserUseCase } from "@/core/usecases/user/list-user-usecase";
import { LoginUseCase } from "@/core/usecases/user/login-usecase";
import { UpdateUserUseCase } from "@/core/usecases/user/update-user-usecase";
import { JWTAuth } from "@/infrastructure/auth/jwt-auth";
import { publicHttpAdapterExpress } from "@/infrastructure/http/express/adapters/http-adapter-express";
import { CreateUserController } from "@/infrastructure/http/express/controllers/user/create-controller";
import { DeleteUserByIDController } from "@/infrastructure/http/express/controllers/user/delete-by-id-controller";
import { ListUserController } from "@/infrastructure/http/express/controllers/user/list-controller";
import { UserLoginController } from "@/infrastructure/http/express/controllers/user/login-controller";
import { UserUpdateController } from "@/infrastructure/http/express/controllers/user/update-controller";
import { ensureIsAdmin } from "@/infrastructure/http/express/middleware/ensure-is-admin";
import { ensureAuthenticated } from "@/infrastructure/http/express/middleware/ensure-is-authenticated";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/prisma/user-repository-prisma";
import { Router } from "express";

const jwtService = new JWTAuth();

const userRepository = new UserRepositoryPrisma(prisma);

const createUserUseCase = new CreateUserUseCase(userRepository);
const createUserController = new CreateUserController(createUserUseCase);

const listUsersUseCase = new ListUserUseCase(userRepository);
const listUserController = new ListUserController(listUsersUseCase);

const loginUseCase = new LoginUseCase(userRepository);
const loginController = new UserLoginController(loginUseCase);

const deleteUseCase = new DeleteUserUseCase(userRepository);
const deleteController = new DeleteUserByIDController(deleteUseCase);

const updateUseCase = new UpdateUserUseCase(userRepository);
const updateController = new UserUpdateController(updateUseCase);

const usersRouter = Router();

const publicUsersRouter = Router();

const authenticatedUserRouter = Router();
authenticatedUserRouter.use(ensureAuthenticated(jwtService));

const adminUserRouter = Router();
adminUserRouter.use(ensureAuthenticated(jwtService), ensureIsAdmin());

adminUserRouter.get("/", publicHttpAdapterExpress(listUserController));

adminUserRouter.post("/create", publicHttpAdapterExpress(createUserController));

publicUsersRouter.post("/login", publicHttpAdapterExpress(loginController));

adminUserRouter.delete(
  "/delete/:id",
  publicHttpAdapterExpress(deleteController)
);

authenticatedUserRouter.patch(
  "/update/:id",
  ensureAuthenticated(jwtService),
  publicHttpAdapterExpress(updateController)
);

usersRouter.use(publicUsersRouter);
usersRouter.use(authenticatedUserRouter);
usersRouter.use(adminUserRouter);

export { usersRouter };
