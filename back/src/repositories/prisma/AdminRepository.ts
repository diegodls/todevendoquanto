import { User } from "../../entities/User";
import { PrismaClientGenerated } from "../../utils/orm/prisma/prismaClient";
import { prismaEntityUserParser } from "../../utils/orm/prisma/prismaEntityUserParser";
import { IAdminRepository } from "../IAdminRepository";

class AdminRepository implements IAdminRepository {
  constructor(private readonly ormClient: PrismaClientGenerated) {}

  public async findUserById(): Promise<User | null> {
    return null;
  }

  public async deleteUserById(id: User["id"]): Promise<User | null> {
    console.log("");
    console.log(`AdminRepository > Deleting user id: ${id}:`);
    const output = await this.ormClient.user.delete({ where: { id } });

    if (!output) return null;

    console.log(output);

    return prismaEntityUserParser(output);
  }
}

export { AdminRepository };
