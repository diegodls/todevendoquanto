import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";
import {
  User as EntityUser,
  UserProps as EntityUserProps,
} from "@/core/entities/user/user";
import { Email } from "@/core/entities/user/value-objects/user-email";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  ListUsersQueryProps,
  ListUsersRequestDTO,
} from "@/core/usecases/user/list-user-dto";
import {
  PrismaClientGenerated,
  PrismaGenerated,
} from "@/infrastructure/repositories/prisma/config/prisma-client";
import { UserRoleMapper } from "@/infrastructure/repositories/prisma/mappers/user/user-role-mapper";

import { listUsersFilters } from "@/infrastructure/repositories/prisma/utils/query-builders/list-user-query-filters";
import { queryFiltersToPrisma } from "@/infrastructure/repositories/prisma/utils/query-filter-to-prisma-where";

import { Password } from "@/core/entities/user/value-objects/password";
import { User as PrismaUser } from "@/prisma";

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
    filters: ListUsersRequestDTO,
  ): Promise<PaginatedResponse<EntityUser>> {
    const { page, page_size, order, order_by, ...filtersOptions } = filters;

    const custom_current_page = page || 1;

    const custom_current_page_size = page_size || 10;

    const customWhere: PrismaUserWhereInput = queryFiltersToPrisma<
      ListUsersQueryProps,
      PrismaUserWhereInput
    >(filtersOptions, listUsersFilters);

    const [total_items, usersList] = await Promise.all([
      this.prismaORMClient.user.count({ where: customWhere }),
      this.prismaORMClient.user.findMany({
        where: customWhere,
        skip: (custom_current_page - 1) * custom_current_page_size,
        take: custom_current_page_size,
        orderBy: { [order_by || "name"]: order || "asc" },
      }),
    ]);

    const total_pages = Math.ceil(total_items / custom_current_page_size);

    let output: PaginatedResponse<EntityUser> = {
      data: [],
      meta: {
        page: custom_current_page,
        page_size: custom_current_page_size,
        has_previous_page: custom_current_page > 1,
        has_next_page: custom_current_page < total_pages,
        total_items,
        total_pages,
      },
    };

    if (usersList.length > 0) {
      const parsedUsersList: EntityUser[] = usersList.map((user) => {
        return this.toDomain({ ...user, hashedPassword: "" });
      });

      output.data = parsedUsersList;
    }

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
}
