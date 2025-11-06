import { UserUpdateInputDTO } from "@/application/dtos/user/user-update-dto";
import { User } from "@/core/domain/user";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import { PrismaClientGenerated } from "@/core/shared/utils/orm/prisma/prisma-client";
import { prismaEntityUserParser } from "@/core/shared/utils/orm/prisma/prisma-entity-user-parser";

export class UserRepositoryPrisma implements UserRepositoryInterface {
  constructor(private readonly ormClient: PrismaClientGenerated) {}
  //! TODO: Maybe unify the findByXYZ and pass the keys of User, to prevent multiples call, like in userService > update

  async findByID(id: string): Promise<User | null> {
    const userExists = await this.ormClient.user.findFirst({
      where: { id },
    });

    if (!userExists) {
      return null;
    }

    const output = prismaEntityUserParser(userExists);

    return output;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userExists = await this.ormClient.user.findFirst({
      where: { email },
    });

    if (!userExists) {
      return null;
    }

    const output = prismaEntityUserParser(userExists);

    return output;
  }

  async findByName(name: string): Promise<User | null> {
    const userExists = await this.ormClient.user.findFirst({
      where: { name },
    });

    if (!userExists) {
      return null;
    }

    const output = prismaEntityUserParser(userExists);

    return output;
  }

  async create(user: User): Promise<User | null> {
    const createdUser = await this.ormClient.user.create({ data: user });

    if (!createdUser) {
      return null;
    }

    const output = prismaEntityUserParser(createdUser);

    return output;
  }

  async update(id: User["id"], data: UserUpdateInputDTO): Promise<User | null> {
    const updatedUser = await this.ormClient.user.update({
      where: { id },
      data,
    });

    const parsedUser = prismaEntityUserParser(updatedUser);

    return parsedUser;
  }
}
