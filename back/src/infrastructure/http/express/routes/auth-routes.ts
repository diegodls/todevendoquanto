import { AUTH_ROUTES_PATH } from "@/core/ports/infrastructure/http/app-routes-paths";
import { LoginUseCase } from "@/core/usecases/auth/login-usecase";
import { publicExpressHttpAdapter } from "@/infrastructure/http/express/adapters/http-adapter-express";
import { UserLoginController } from "@/infrastructure/http/express/controllers/auth/login-controller";

import { JwtGenerateToken } from "@/infrastructure/protocols/jwt/jwt-generate-token";
import { PasswordHasher } from "@/infrastructure/protocols/passwordHasher";
import { prisma } from "@/infrastructure/repositories/prisma/config/prisma-client";
import { UserRepositoryPrisma } from "@/infrastructure/repositories/prisma/user-repository-prisma";
import { Router } from "express";

const userRepository = new UserRepositoryPrisma(prisma);

const jwtGenerateToken = new JwtGenerateToken();

const compare = new PasswordHasher();

const loginUseCase = new LoginUseCase(
  userRepository,
  compare,
  jwtGenerateToken,
);

const loginController = new UserLoginController(loginUseCase);

const authRouter = Router();

authRouter.post(
  AUTH_ROUTES_PATH.login,
  publicExpressHttpAdapter(loginController),
);

export { authRouter };
