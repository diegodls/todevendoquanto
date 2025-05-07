import { User, UserPermissions, UserRole } from "../../../entities/user";
import { PrismaClient } from "../../../generated/prisma";
import { AdminRepositoryInterface } from "../admin.repository.interface";

export class AdminRepositoryPrisma implements AdminRepositoryInterface {
  private constructor(readonly repository: PrismaClient) {}

  public static build(repository: PrismaClient) {
    return new AdminRepositoryPrisma(repository);
  }

  public async create(user: User) {
    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      permissions: user.permissions,
    };

    const newUser = await this.repository.user.create({ data });

    if (!newUser) {
      return null;
    }

    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    console.log("IIIIIIIIIIIIII");

    PAREI AQUI, ACHO QUE O BANCO ESTÁ DOWN, NÃO ESTÁ SALVANDO
    VERIFICAR O FLUXO E TESTAR O "admin.authorization.middleware.express.ts"

    console.log(email);

    const userExists = await this.repository.user.findFirst({
      where: { email },
    });
    console.log(userExists);

    console.log("JJJJJJJJJJJJJJJJJJJJ");
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
