import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";
import { User } from "@/core/entities/user/user";
import { Email } from "@/core/entities/user/value-objects/user-email";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import { DeleteUserByIDOutputDTO } from "@/core/usecases/user/delete-user-dto";
import {
  ListUsersQueryProps,
  ListUsersRequestDTO,
} from "@/core/usecases/user/list-user-dto";
import { UpdateUserInputDTO } from "@/core/usecases/user/update-user-dto";
import {
  PrismaClientGenerated,
  PrismaGenerated,
} from "@/infrastructure/repositories/prisma/config/prisma-client";
import { UserRoleMapper } from "@/infrastructure/repositories/prisma/mappers/user/user-role-mapper";
import { prismaUserEntityParser } from "@/infrastructure/repositories/prisma/utils/prisma-user-to-entity-parser";
import { listUsersFilters } from "@/infrastructure/repositories/prisma/utils/query-builders/list-user-query-filters";
import { queryFiltersToPrisma } from "@/infrastructure/repositories/prisma/utils/query-filter-to-prisma-where";
import { User as UserP } from "./../../../../generated/prisma/index.d";

type PrismaUserWhereInput = PrismaGenerated.UserWhereInput;
export class UserRepositoryPrisma implements UserRepositoryInterface {
  constructor(private readonly prismaORMClient: PrismaClientGenerated) {}

  async findById(id: UserId): Promise<User | null> {
    const userExists = await this.prismaORMClient.user.findFirst({
      where: { id: id.toString() },
    });

    if (!userExists) {
      return null;
    }

    const output = prismaUserEntityParser(userExists);

    return output;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userExists = await this.prismaORMClient.user.findFirst({
      where: { email: email.toString() },
    });

    if (!userExists) {
      return null;
    }

    const output = prismaUserEntityParser(userExists);

    return output;
  }

  async findByName(name: string): Promise<User | null> {
    const userExists = await this.prismaORMClient.user.findFirst({
      where: { name },
    });

    if (!userExists) {
      return null;
    }

    const output = prismaUserEntityParser(userExists);

    return output;
  }

  async create(user: User): Promise<User | null> {
    const rawRole = UserRoleMapper.toPersistence(user.role);

    const data: UserP = {
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

    const output = prismaUserEntityParser(createdUser);

    return output;
  }

  async update(id: UserId, data: UpdateUserInputDTO): Promise<User | null> {
    const updatedUser = await this.prismaORMClient.user.update({
      where: { id: id.toString() },
      data,
    });

    const parsedUser = prismaUserEntityParser(updatedUser);

    return parsedUser;
  }

  async deleteById(id: UserId): Promise<DeleteUserByIDOutputDTO> {
    const deleteUser = await this.prismaORMClient.user.delete({
      where: { id: id.toString() },
    });

    const output = { id: deleteUser.id };

    return output;
  }

  async list(filters: ListUsersRequestDTO): Promise<PaginatedResponse<User>> {
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

    let output: PaginatedResponse<User> = {
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
      const parsedUsersList: User[] = usersList.map((user) => {
        return prismaUserEntityParser({ ...user, hashedPassword: "" });
      });

      output.data = parsedUsersList;
    }

    return output;
  }
}
