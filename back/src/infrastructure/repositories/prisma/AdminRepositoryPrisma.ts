import {
  UserListQueryProps,
  UserListRequestDTO,
} from "@/application/dtos/admin/UserListDTO";
import { PaginatedResponse } from "@/application/dtos/shared/PaginationDTO";
import { User } from "@/core/domain/User";
import { IAdminRepository } from "@/core/ports/repositories/IAdminRepository";
import {
  PrismaClientGenerated,
  PrismaGenerated,
} from "@/core/shared/utils/orm/prisma/prismaClient";
import { prismaEntityUserParser } from "@/core/shared/utils/orm/prisma/prismaEntityUserParser";
import { filterMapper } from "@/infrastructure/repositories/prisma/helpers/FilterMapper";
//import { Prisma } from "@prisma/client";
//import { PrismaClientGenerated } from "../../utils/orm/prisma/prismaClient";

class AdminRepositoryPrisma implements IAdminRepository {
  constructor(private readonly ormClient: PrismaClientGenerated) {}

  public async findUserById(id: User["id"]): Promise<User | null> {
    const user = await this.ormClient.user.findUnique({ where: { id } });

    return user ? prismaEntityUserParser(user) : null;
  }

  public async deleteUserById(id: User["id"]): Promise<User | null> {
    const output = await this.ormClient.user.delete({ where: { id } });

    return output ? prismaEntityUserParser(output) : null;
  }

  public async listUsers(
    input: UserListRequestDTO
  ): Promise<PaginatedResponse<User>> {
    const customWhere: PrismaGenerated.UserWhereInput = {};

    const { page, page_size, order, order_by, ...filtersOptions } = input;

    //const paginationOptions = { page, page_size, order, order_by };

    const custom_current_page = page || 1;

    const custom_current_page_size = page_size || 10;

    for (const key in filterMapper) {
      const filterKey = key as keyof UserListQueryProps;

      if (
        filtersOptions[filterKey] !== undefined &&
        filtersOptions[filterKey] !== null &&
        filtersOptions[filterKey] !== ""
      ) {
        const value = filtersOptions[filterKey];
        const mapperFunction = filterMapper[filterKey];

        console.log(`${key}: ${value}`);

        if (mapperFunction) {
          const whereClause = (mapperFunction as any)(value);
          console.log("");
          console.log(`where_clause_valid: ${filterKey} : ${value}`);
          console.log(`${whereClause}`);
          Object.assign(customWhere, whereClause);
        }
      }
    }

    console.log("");
    console.log("customWhere");
    console.log(customWhere);
    console.log("");
    console.log(customWhere.role);
    console.log("");

    const [total_items, usersList] = await Promise.all([
      this.ormClient.user.count({ where: customWhere }),
      this.ormClient.user.findMany({
        where: customWhere,
        skip: (custom_current_page - 1) * custom_current_page_size,
        take: custom_current_page_size,
        orderBy: { [order_by!]: order },
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

    console.log("");
    console.log("🔴🔴🔴🔴");
    console.log("");
    console.log("****REPOSITORY****");
    console.log("");
    console.log(`usersList: ${usersList.length}`);
    console.log("");
    console.log(`total_items: ${total_items}`);
    console.log("");
    console.log("");

    if (usersList.length > 0) {
      const parsedUsersList: User[] = usersList.map((user) => {
        return prismaEntityUserParser({ ...user, password: "" });
      });

      output.data = parsedUsersList;
    }

    return output;
  }
}

export { AdminRepositoryPrisma };
