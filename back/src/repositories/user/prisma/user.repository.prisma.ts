import { User } from "../../../entities/user";
import { PrismaClient } from "../../../generated/prisma";
import { UserRepository } from "./../user.repository";

export class UserRepositoryPrisma implements UserRepository {
  private constructor(readonly repository: PrismaClient) {}

  public static build(repository: PrismaClient) {
    return new UserRepositoryPrisma(repository);
  }

  public async create(user: User): Promise<void> {
    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      type: user.type,
      permissions: user.permissions,
    };

    await this.repository.user.create({ data });
  }

  public async findByEmail(email: string): Promise<User | null> {
    const userExists = await this.repository.user.findFirst({
      where: { email },
    });

    if (!userExists) {
      return null;
    }

    const { id, name, password, role, permissions } = userExists;

    const output = User.with();

    PAREI AQUI

    return userExists;
  }
}
