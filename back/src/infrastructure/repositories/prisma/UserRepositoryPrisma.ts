import { User, UserRole } from "@/core/domain/User";
import { IUserRepository } from "@/core/ports/repositories/IUserRepository";
import { PrismaClientGenerated } from "@/core/shared/utils/orm/prisma/prismaClient";

class UserRepositoryPrisma implements IUserRepository {
  constructor(private readonly repository: PrismaClientGenerated) {}

  async findByEmail(email: string): Promise<User | null> {
    const userExists = await this.repository.user.findFirst({
      where: { email },
    });

    if (!userExists) {
      return null;
    }

    const { id, name, password, created_at, updated_at, is_active } =
      userExists;

    const parsedRole: UserRole = UserRole[userExists.role];

    const userOutput: User = {
      id,
      email,
      name,
      password,
      role: parsedRole,
      created_at,
      updated_at,
      is_active,
    };

    return userOutput;
  }

  async create(user: User): Promise<User | null> {
    const createdUser = await this.repository.user.create({ data: user });

    if (!createdUser) {
      return null;
    }

    const { id, name, email, password } = createdUser;

    const parsedRole: UserRole = UserRole[createdUser.role];

    const userOutput: User = {
      id,
      email,
      name,
      password,
      role: parsedRole,
      created_at: new Date(),
      updated_at: new Date(),
      is_active: true,
    };

    return userOutput;
  }
}

export { UserRepositoryPrisma };
