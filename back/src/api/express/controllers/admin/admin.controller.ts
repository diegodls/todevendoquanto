import { Response } from "express";

import { AdminRepositoryPrisma } from "../../../../repositories/admin/prisma/admin.repository.prisma";
import { AdminService } from "../../../../services/admin/admin.service";
import { CustomApiErrors } from "../../../../util/api.errors";
import { prisma } from "../../../../util/orm/prisma/prisma.util";
import {
  AdminControllerInterface,
  CreateUserRequestBody,
  FindUserByEmailRequestQueryParams,
} from "./admin.controller.interface";

export class AdminController implements AdminControllerInterface {
  private constructor() {}

  public static build() {
    return new AdminController();
  }

  public async create(
    request: CreateUserRequestBody,
    response: Response
  ): Promise<void> {
    const { name, email, password } = request.body;

    console.log(request.body);

    const repository = AdminRepositoryPrisma.build(prisma);

    const service = AdminService.build(repository);
    console.log("DDDDDDDDDDDDDD");

    const data = await service.create(name, email, password);

    const output = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      permissions: data.permissions,
    };

    response.status(201).json(output).send();
  }

  public async findByEmail(
    req: FindUserByEmailRequestQueryParams,
    res: Response
  ): Promise<void> {
    const { email } = req.query;

    if (!email) {
      throw new CustomApiErrors.BadRequestError(
        "Email wasn't send or is invalid!"
      );
    }

    const repository = AdminRepositoryPrisma.build(prisma);

    const service = AdminService.build(repository);

    const output = await service.findByEmail(String(email));

    const data = {
      id: output.id,
      name: output.name,
      email: output.email,
      role: output.role,
      permissions: output.permissions,
    };

    res.status(201).json(data).send();
  }
}
