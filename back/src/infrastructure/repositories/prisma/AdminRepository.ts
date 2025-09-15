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
    let customWhere: PrismaGenerated.UserWhereInput = {};

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

    /*
    ! FIXME: ADD "isActive" ON USER PROPS
    if (input.filters?.isActive) {
      customWhere.isActive = input.filters?.isActive; 
    }
    */

    const [total, usersList] = await Promise.all([
      this.ormClient.user.count({ where: customWhere }),
      this.ormClient.user.findMany({
        where: customWhere,
        skip: (customCurrentPage - 1) * customCurrentPageSize,
        take: customCurrentPageSize,
        orderBy: customCurrentOrderBy,
      }),
    ]);

    let output: PaginationOutputDTO<User> = {
      page: 0,
      page_size: 0,
      next_page: 0,
      total_items: total,
      total_pages: 0,
      data: [],
    };

    if (usersList.length > 0) {
      const parsedUsersList: User[] = usersList.map((user) => {
        return prismaEntityUserParser(user);
      });

      output = {
        page: 0,
        next_page: 0,
        page_size: 0,
        total_items: 0,
        total_pages: 0,
        data: parsedUsersList,
      };

      return output;
    }

    return output;
  }
}

export { AdminRepository };
