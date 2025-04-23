import { Response } from "express";
import { UserRepositoryPrisma } from "../../../../repositories/user/prisma/user.repository.prisma";
import { UserServiceImplementation } from "../../../../services/user/implemmentation/user.implementation";
import { prisma } from "../../../../util/prisma.util";
import {
  CreateRequestBody,
  UserControllerContract,
} from "./user.controller.interface";

export class UserController implements UserControllerContract {
  private constructor() {}

  public static build() {
    return new UserController();
  }

  public async create(
    request: CreateRequestBody,
    response: Response
  ): Promise<void> {
    const { name, email, password } = request.body;

    const repository = UserRepositoryPrisma.build(prisma);

    const service = UserServiceImplementation.build(repository);

    const output = await service.create(name, email, password);

    const data = {
      id: output.id,
      name: output.name,
      email: output.email,
      role: output.role,
      permissions: output.permissions,
    };

    response.status(201).json(data).send();
  }
}
