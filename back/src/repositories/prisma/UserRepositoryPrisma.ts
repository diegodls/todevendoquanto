import { User, UserRole } from "../../entities/User";
import { PrismaClientGenerated } from "../../utils/orm/prisma/prismaClient";
import { IUserRepository } from "../IUserRepository";

export class UserRepositoryPrisma implements IUserRepository {
  constructor(private readonly repository: PrismaClientGenerated) {}

  async findByEmail(email: string): Promise<User | null> {
    const userExists = await this.repository.user.findFirst({
      where: { email },
    });

    if (!userExists) {
      return null;
    }

    const { id, name, password } = userExists;

    const parsedRole: UserRole = UserRole[userExists.role];

    const userOutput: User = { id, email, name, password, role: parsedRole };

    return userOutput;
  }

  async create(user: User): Promise<User | null> {
    const createdUser = await this.repository.user.create({ data: user });

    if (!createdUser) {
      return null;
    }

    const { id, name, email, password } = createdUser;

    const parsedRole: UserRole = UserRole[createdUser.role];

    const userOutput: User = { id, email, name, password, role: parsedRole };

    return userOutput;
  }
}
