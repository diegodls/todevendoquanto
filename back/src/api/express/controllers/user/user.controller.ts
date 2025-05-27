import { Response } from "express";
import { UserRepositoryPrisma } from "../../../../repositories/user/prisma/user.repository.prisma";
import { UserService } from "../../../../services/user/user.service";
import { prisma } from "../../../../util/orm/prisma/prisma.util";
import {
  LoginUserRequestBody,
  UserControllerInterface,
} from "./user.controller.interface";

export class UserController implements UserControllerInterface {
  public static build() {
    return new UserController();
  }

  public async login(req: LoginUserRequestBody, res: Response): Promise<void> {
    // zod validation(middleware)
    const { email, password } = req.body;

    const repository = UserRepositoryPrisma.build(prisma);

    const service = UserService.build(repository);

    const output = await service.generateUserLoginToken({ email, password });

    res.status(200).json(output).send();
  }
}
