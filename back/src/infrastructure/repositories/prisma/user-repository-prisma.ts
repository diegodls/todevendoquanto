import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";
import { User } from "@/core/entities/user";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  ListUsersQueryProps,
  ListUsersRequestDTO,
} from "@/core/usecases/user/list-user-dto";
import { UpdateUserInputDTO } from "@/core/usecases/user/update-user-dto";
import {
  PrismaClientGenerated,
  PrismaGenerated,
} from "@/infrastructure/repositories/prisma/config/prisma-client";
import { prismaEntityUserParser } from "@/infrastructure/repositories/prisma/utils/prisma-entity-user-parser";
import { listUsersFilters } from "@/infrastructure/repositories/prisma/utils/query-builders/list-user-query-filters";
import { queryFiltersToPrisma } from "@/infrastructure/repositories/prisma/utils/query-filter-to-prisma-where";

type PrismaUserWhereInput = PrismaGenerated.UserWhereInput;
export class UserRepositoryPrisma implements UserRepositoryInterface {
  constructor(private readonly prismaORMClient: PrismaClientGenerated) {}

  async findById(id: string): Promise<User | null> {
    const userExists = await this.prismaORMClient.user.findFirst({
      where: { id },
    });

    if (!userExists) {
      return null;
    }

    const output = prismaEntityUserParser(userExists);

    return output;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userExists = await this.prismaORMClient.user.findFirst({
      where: { email },
    });

    if (!userExists) {
      return null;
    }

    const output = prismaEntityUserParser(userExists);

    return output;
  }

  async findByName(name: string): Promise<User | null> {
    const userExists = await this.prismaORMClient.user.findFirst({
      where: { name },
    });

    if (!userExists) {
      return null;
    }

    const output = prismaEntityUserParser(userExists);

    return output;
  }

  async create(user: User): Promise<User | null> {
    const createdUser = await this.prismaORMClient.user.create({ data: user });

    if (!createdUser) {
      return null;
    }

    const output = prismaEntityUserParser(createdUser);

    return output;
  }

  async update(id: User["id"], data: UpdateUserInputDTO): Promise<User | null> {
    const updatedUser = await this.prismaORMClient.user.update({
      where: { id },
      data,
    });

    const parsedUser = prismaEntityUserParser(updatedUser);

    return parsedUser;
  }

  async deleteById(id: User["id"]): Promise<User | null> {
    const output = await this.prismaORMClient.user.delete({ where: { id } });

    return output ? prismaEntityUserParser(output) : null;
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
        return prismaEntityUserParser({ ...user, password: "" });
      });

      output.data = parsedUsersList;
    }

    return output;
  }
}
