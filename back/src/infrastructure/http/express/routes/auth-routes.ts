import { AUTH_ROUTES_PATH } from "@/core/ports/infrastructure/http/app-routes-paths";
import { LoginUseCase } from "@/core/usecases/auth/login-usecase";
import { JwtGenerateToken } from "@/infrastructure/auth/jwt-generate-token";
import { Compare } from "@/infrastructure/encryption/compare";
import { publicExpressHttpAdapter } from "@/infrastructure/http/express/adapters/http-adapter-express";
import { UserLoginController } from "@/infrastructure/http/express/controllers/auth/login-controller";
import { prisma } from "@/infrastructure/repositories/prisma/config/prisma-client";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/prisma/user-repository-prisma";
import { Router } from "express";

const userRepository = new UserRepositoryPrisma(prisma);

const jwtGenerateToken = new JwtGenerateToken();

const compare = new Compare();

const loginUseCase = new LoginUseCase(
  userRepository,
  compare,
  jwtGenerateToken
);

const loginController = new UserLoginController(loginUseCase);

const authRouter = Router();

authRouter.post(
  AUTH_ROUTES_PATH.login,
  publicExpressHttpAdapter(loginController)
);

export { authRouter };
