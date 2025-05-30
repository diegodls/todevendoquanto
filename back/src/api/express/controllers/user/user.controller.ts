import { Response } from "express";
import { UserRepositoryPrisma } from "../../../../repositories/user/prisma/user.repository.prisma";
import { UserService } from "../../../../services/user/user.service";
import { UserServiceInterface } from "../../../../services/user/user.service.interface";
import { prisma } from "../../../../util/orm/prisma/prisma.util";
import {
  LoginUserRequestBody,
  UserControllerInterface,
} from "./user.controller.interface";

export class UserController implements UserControllerInterface {
  private constructor(
    readonly serviceTest: UserServiceInterface,
    readonly repositoryTest: UserRepositoryPrisma
  ) {}

  public static build(
    serviceTest: UserServiceInterface,
    repositoryTest: UserRepositoryPrisma
  ) {
    return new UserController(serviceTest, repositoryTest);
  }

  login = async (req: LoginUserRequestBody, res: Response): Promise<void> => {
    // zod validation(middleware)
    const { email, password } = req.body;
    console.log("🟧🔴");
    const users = await this.repositoryTest.findByEmail("user002@email.com");
    console.log("🟧🔴🔴");
    console.log(users);
    console.log("🟧🔴🔴🔴");

    const repository = UserRepositoryPrisma.build(prisma);

    const service = UserService.build(repository);
    console.log("❌🔴🔴🔴🔴");
    console.log(this.serviceTest);
    console.log("🟩🔴🔴🔴🔴");
    console.log(service);

    const output = await service.generateUserLoginToken({ email, password });

    res.status(200).json(output).send();
  };
}
