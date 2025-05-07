import { User, UserPermissions, UserRole } from "../../../entities/user";
import { PrismaClient } from "../../../generated/prisma";
import { UserRepositoryInterface } from "../user.repository.interface";

export class UserRepositoryPrisma implements UserRepositoryInterface {
  private constructor(readonly repository: PrismaClient) {}

  public static build(repository: PrismaClient) {
    return new UserRepositoryPrisma(repository);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const userExists = await this.repository.user.findUnique({
      where: { email },
    });

    if (!userExists) {
      return null;
    }

    const { id, name, password } = userExists;

    const role: UserRole = UserRole[userExists.role];

    const permissions = userExists.permissions as UserPermissions[];

    const output = User.with(id, name, email, password, role, permissions);

    return output;
  }
}
