import { PaginationDTO } from "@/application/dtos/shared/pagination-dto";
import {
  User as EntityUser,
  UserProps as EntityUserProps,
} from "@/core/entities/user/user";
import { Email } from "@/core/entities/user/value-objects/user-email";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import {
  PaginatedResult,
  UserRepositoryInterface,
} from "@/core/ports/repositories/user-repository-interface";
import {
  ListUsersFiltersOptions,
  ListUsersOrderRequestProps,
} from "@/core/usecases/user/list-user-dto";
import {
  PrismaClientGenerated,
  PrismaGenerated,
} from "@/infrastructure/repositories/prisma/config/prisma-client";
import { UserRoleMapper } from "@/infrastructure/repositories/prisma/mappers/user/user-role-mapper";

import { listUsersFilters } from "@/infrastructure/repositories/prisma/utils/query-builders/list-user-query-filters";

import { Password } from "@/core/entities/user/value-objects/password";
import { User as PrismaUser } from "@/prisma";

export type GenericFilterMapper<
  TFilterObject extends object,
  TPrismaWhere extends object,
> = {
  [K in keyof TFilterObject]?: (
    value: NonNullable<TFilterObject[K]>,
  ) => TPrismaWhere;
};

type PrismaUserWhereInput = PrismaGenerated.UserWhereInput;
export class UserRepositoryPrisma implements UserRepositoryInterface {
  constructor(private readonly prismaORMClient: PrismaClientGenerated) {}

  async findById(id: UserId): Promise<EntityUser | null> {
    const userExists = await this.prismaORMClient.user.findFirst({
      where: { id: id.toString() },
    });

    if (!userExists) {
      return null;
    }

    const output = this.toDomain(userExists);

    return output;
  }

  async findByEmail(email: Email): Promise<EntityUser | null> {
    const userExists = await this.prismaORMClient.user.findFirst({
      where: { email: email.toString() },
    });

    if (!userExists) {
      return null;
    }

    const output = this.toDomain(userExists);

    return output;
  }

  async findByName(name: string): Promise<EntityUser | null> {
    const userExists = await this.prismaORMClient.user.findFirst({
      where: { name },
    });

    if (!userExists) {
      return null;
    }

    const output = this.toDomain(userExists);

    return output;
  }

  async create(user: EntityUser): Promise<EntityUser | null> {
    const rawRole = UserRoleMapper.toPersistence(user.role);

    const data: PrismaUser = {
      id: user.id.toString(),
      name: user.name,
      hashedPassword: user.hashedPassword,
      email: user.email.toString(),
      role: rawRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
    };

    const createdUser = await this.prismaORMClient.user.create({ data });

    if (!createdUser) {
      return null;
    }

    const output = this.toDomain(createdUser);

    return output;
  }

  async update(user: EntityUser): Promise<EntityUser | null> {
    const persistenceUser = this.toPersistence(user);

    const updatedUser = await this.prismaORMClient.user.update({
      where: { id: user.id.toString() },
      data: persistenceUser,
    });

    const parsedUser: EntityUser = this.toDomain(updatedUser);

    return parsedUser;
  }

  async deleteById(id: UserId): Promise<EntityUser | null> {
    const deleteUser = await this.prismaORMClient.user.delete({
      where: { id: id.toString() },
    });

    const output = this.toDomain(deleteUser);

    return output;
  }

  async list(
    filters: ListUsersFiltersOptions,
    order: ListUsersOrderRequestProps,
    pagination: PaginationDTO,
  ): Promise<PaginatedResult<EntityUser>> {
    const where: PrismaUserWhereInput = this.buildPrismaWhere<
      ListUsersFiltersOptions,
      PrismaUserWhereInput
    >(filters, listUsersFilters);

    const skip = (pagination.page - 1) * pagination.pageSize;

    const take = pagination.pageSize;

    const orderBy = { [order.orderBy]: order.order };

    const [totalItems, usersList] = await Promise.all([
      this.prismaORMClient.user.count({ where }),
      this.prismaORMClient.user.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
    ]);

    let output: PaginatedResult<EntityUser> = {
      data: usersList.map((user) => this.toDomain(user)),
      total: totalItems,
    };

    return output;
  }

  private toDomain(prismaUser: PrismaUser): EntityUser {
    const userId = UserId.from(prismaUser.id);
    const userName = prismaUser.name;
    const userEmail = Email.create(prismaUser.email);
    const userHashedPassword = Password.create(prismaUser.hashedPassword);
    const userRole = UserRoleMapper.toDomain(prismaUser.role);

    const props: EntityUserProps = {
      id: userId,
      name: userName,
      email: userEmail,
      hashedPassword: userHashedPassword.getValue(),
      role: userRole,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      isActive: prismaUser.isActive,
    };

    const output = EntityUser.reconstitute(props);

    return output;
  }

  private toPersistence(user: EntityUser): PrismaUser {
    const output: PrismaUser = {
      id: user.id.toString(),
      name: user.name.toString(),
      email: user.email.toString(),
      hashedPassword: user.hashedPassword.toString(),
      role: UserRoleMapper.toPersistence(user.role),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
    };

    return output;
  }

  private buildPrismaWhere = <
    TFilters extends object,
    TPrismaWhere extends object,
  >(
    filters: TFilters,
    query: GenericFilterMapper<TFilters, TPrismaWhere>,
  ): TPrismaWhere => {
    const where = {} as TPrismaWhere;

    for (const key in query) {
      const filterKey = key as keyof TFilters;

      const inputValue = filters[filterKey];

      if (
        inputValue !== undefined &&
        inputValue !== null &&
        inputValue !== ""
      ) {
        const mapperFunction = query[filterKey];

        if (mapperFunction) {
          const whereClause = (mapperFunction as any)(inputValue);
          Object.assign(where, whereClause);
        }
      }
    }

    return where;
  };
}
