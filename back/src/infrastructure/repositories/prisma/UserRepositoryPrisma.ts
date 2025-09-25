import { UserUpdateInputDTO } from "@/application/dtos/user/UserUpdateDTO";
import { User } from "@/core/domain/User";
import { IJwtPayload } from "@/core/ports/infrastructure/auth/IJWTAuth";
import { IUserRepository } from "@/core/ports/repositories/IUserRepository";
import { PrismaClientGenerated } from "@/core/shared/utils/orm/prisma/prismaClient";
import { prismaEntityUserParser } from "@/core/shared/utils/orm/prisma/prismaEntityUserParser";
import { Prisma } from '@/prisma';

class UserRepositoryPrisma implements IUserRepository {
  constructor(private readonly ormClient: PrismaClientGenerated) {}

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

  async create(user: User): Promise<User | null> {
    const createdUser = await this.ormClient.user.create({ data: user });

    if (!createdUser) {
      return null;
    }

    const output = prismaEntityUserParser(createdUser);

    return output;
  }

  async update(
    user: IJwtPayload,
    data: UserUpdateInputDTO
  ): Promise<User | null> {
    const updatedUser = await this.ormClient.user.update()

    PAREI AQUI, TEM QUE CONTINUAR A FAZER O UPDATE COM O Prisma, SEI LÁ, CRIAR UM OBJETO COM OS CAMPS EXISTENTES:

    CONST FIELS = {}

    E ADICIONAR O QUE VIER NO "DATA", USANDO O EMAIL DO USER PARA ALTERAR, PENSA AI
  }
}

export { UserRepositoryPrisma };
