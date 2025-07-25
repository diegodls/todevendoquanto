
import { User } from '@/core/domain/User';
import { IAdminRepository } from '@/core/ports/repositories/IAdminRepository';
import { PrismaClientGenerated } from '@/core/shared/utils/orm/prisma/prismaClient';
import { prismaEntityUserParser } from '@/core/shared/utils/orm/prisma/prismaEntityUserParser';
//import { PrismaClientGenerated } from "../../utils/orm/prisma/prismaClient";


class AdminRepository implements IAdminRepository {
  constructor(private readonly ormClient: PrismaClientGenerated) {}

  public async findUserById(id: User["id"]): Promise<User | null> {
    const user = await this.ormClient.user.findUnique({ where: { id } });

    return user ? prismaEntityUserParser(user) : null;
  }

  public async deleteUserById(id: User["id"]): Promise<User | null> {
    console.log("");
    console.log(`AdminRepository > Deleting user id: ${id}:`);

    const output = await this.ormClient.user.delete({ where: { id } });

    console.log(output);

    return output ? prismaEntityUserParser(output) : null;
  }
}

export { AdminRepository };
