import {
  GenericOrderBy,
  ListUsersControllerFilters,
  PaginationInputDTO,
  PaginationOutputDTO,
} from "@/application/dtos/PaginationDTO";
import { User } from "@/core/domain/User";
import { IAdminRepository } from "@/core/ports/repositories/IAdminRepository";
import {
  PrismaClientGenerated,
  PrismaGenerated,
} from "@/core/shared/utils/orm/prisma/prismaClient";
import { prismaEntityUserParser } from "@/core/shared/utils/orm/prisma/prismaEntityUserParser";
//import { Prisma } from "@prisma/client";
//import { PrismaClientGenerated } from "../../utils/orm/prisma/prismaClient";

class AdminRepository implements IAdminRepository {
  constructor(private readonly ormClient: PrismaClientGenerated) {}

  public async findUserById(id: User["id"]): Promise<User | null> {
    const user = await this.ormClient.user.findUnique({ where: { id } });

    return user ? prismaEntityUserParser(user) : null;
  }

  public async deleteUserById(id: User["id"]): Promise<User | null> {
    console.log("");
    console.log(`AdminRepository > Deleting user id: ${id}:`);

    const output = await this.ormClient.user.delete({ where: { id } });

    console.log(output);

    return output ? prismaEntityUserParser(output) : null;
  }

  public async listUsers(
    input: PaginationInputDTO<User, ListUsersControllerFilters>
  ): Promise<PaginationOutputDTO<User>> {
    let customWhere: PrismaGenerated.UserWhereInput = { is_active: true };

    const customCurrentPage = input.page || 1;

    const customCurrentPageSize = input.page_size || 10;

    const customCurrentOrderBy: GenericOrderBy<User> = input.order_by || {
      name: "asc",
    };

    if (input.filters?.email) {
      customWhere.email = {
        contains: input.filters.email,
        mode: "insensitive",
      };
    }

    if (input.filters?.role) {
      customWhere.role = input.filters?.role;
    }

    if (!input.filters?.is_active && input.filters?.is_active === false) {
      customWhere.is_active = false;
    }

    const [total_items_count, usersList] = await Promise.all([
      this.ormClient.user.count({ where: customWhere }),
      this.ormClient.user.findMany({
        where: customWhere,
        skip: (customCurrentPage - 1) * customCurrentPageSize,
        take: customCurrentPageSize,
        orderBy: customCurrentOrderBy,
      }),
    ]);

    let output: PaginationOutputDTO<User> = {
      page: 1,
      page_size: 0,
      next_page: 0,
      total_items: 0,
      total_pages: 0,
      data: [],
    };

    if (usersList.length > 0) {
      const parsedUsersList: User[] = usersList.map((user) => {
        return prismaEntityUserParser(user);
      });

      let new_next_page = customCurrentPage;

      if (total_items_count - customCurrentPage * customCurrentPageSize > 1) {
        new_next_page = customCurrentPage + 1;
      }

      output = {
        page: customCurrentPage,
        next_page: new_next_page,
        page_size: customCurrentPageSize,
        total_items: total_items_count,
        total_pages: Math.ceil(total_items_count / customCurrentPageSize),
        data: parsedUsersList,
      };

      return output;
    }

    return output;
  }
}

export { AdminRepository };
