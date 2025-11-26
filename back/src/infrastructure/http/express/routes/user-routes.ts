import { prisma } from "@/core/shared/utils/orm/prisma/prisma-client";
import { CreateUserUseCase } from "@/core/usecases/user/create-user-usecase";
import { DeleteUserUseCase } from "@/core/usecases/user/delete-user-usecase";
import { ListUserUseCase } from "@/core/usecases/user/list-user-usecase";
import { LoginUseCase } from "@/core/usecases/user/login-usecase";
import { UpdateUserUseCase } from "@/core/usecases/user/update-user-usecase";
import { JwtGenerateToken } from "@/infrastructure/auth/jwt-generate-token";
import { JwtVerifyToken } from "@/infrastructure/auth/jwt-verify-token";
import { Compare } from "@/infrastructure/encryption/compare";
import { Encrypt } from "@/infrastructure/encryption/encrypt";
import {
  authenticatedExpressHttpAdapter,
  publicExpressHttpAdapter,
} from "@/infrastructure/http/express/adapters/http-adapter-express";
import { CreateUserController } from "@/infrastructure/http/express/controllers/user/create-controller";
import { DeleteUserByIDController } from "@/infrastructure/http/express/controllers/user/delete-by-id-controller";
import { ListUserController } from "@/infrastructure/http/express/controllers/user/list-controller";
import { UserLoginController } from "@/infrastructure/http/express/controllers/user/login-controller";
import { UserUpdateController } from "@/infrastructure/http/express/controllers/user/update-controller";
import { ensureIsAdmin } from "@/infrastructure/http/express/middleware/ensure-is-admin";
import { ensureIsAuthenticated } from "@/infrastructure/http/express/middleware/ensure-is-authenticated";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/prisma/user-repository-prisma";
import { Router } from "express";

const jwtVerifyToken = new JwtVerifyToken();
const jwtGenerateToken = new JwtGenerateToken();

const encrypt = new Encrypt();
const compare = new Compare();

const userRepository = new UserRepositoryPrisma(prisma);

const createUserUseCase = new CreateUserUseCase(userRepository, encrypt);
const createUserController = new CreateUserController(createUserUseCase);

const listUsersUseCase = new ListUserUseCase(userRepository);
const listUserController = new ListUserController(listUsersUseCase);

const loginUseCase = new LoginUseCase(
  userRepository,
  compare,
  jwtGenerateToken
);
const loginController = new UserLoginController(loginUseCase);

const deleteUseCase = new DeleteUserUseCase(userRepository);
const deleteController = new DeleteUserByIDController(deleteUseCase);

const updateUseCase = new UpdateUserUseCase(userRepository);
const updateController = new UserUpdateController(updateUseCase);

const usersRouter = Router();

const publicUsersRouter = Router();

publicUsersRouter.post("/login", publicExpressHttpAdapter(loginController));

const authenticatedUserRouter = Router();
authenticatedUserRouter.use(ensureIsAuthenticated(jwtVerifyToken));

authenticatedUserRouter.patch(
  "/update/:id",
  ensureIsAuthenticated(jwtVerifyToken),
  authenticatedExpressHttpAdapter(updateController)
);

const adminUserRouter = Router();
adminUserRouter.use(ensureIsAuthenticated(jwtVerifyToken), ensureIsAdmin());

adminUserRouter.get("/", authenticatedExpressHttpAdapter(listUserController));

adminUserRouter.post(
  "/create",
  authenticatedExpressHttpAdapter(createUserController)
);

adminUserRouter.delete(
  "/delete/:id",
  authenticatedExpressHttpAdapter(deleteController)
);

usersRouter.use(publicUsersRouter);
usersRouter.use(authenticatedUserRouter);
usersRouter.use(adminUserRouter);

export { usersRouter };
