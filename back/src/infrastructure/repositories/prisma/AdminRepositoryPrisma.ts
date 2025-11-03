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
import { mapFiltersToPrisma } from "@/infrastructure/repositories/prisma/utils/mapFilterToPrismaWhere";
import { userListFilterMapper } from "@/infrastructure/repositories/prisma/utils/mappers/UserListFilterMapper";
//import { Prisma } from "@prisma/client";
//import { PrismaClientGenerated } from "../../utils/orm/prisma/prismaClient";

type PrismaUserWhereInput = PrismaGenerated.UserWhereInput;

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
    const { page, page_size, order, order_by, ...filtersOptions } = input;

    const custom_current_page = page || 1;

    const custom_current_page_size = page_size || 10;

    const customWhere: PrismaUserWhereInput = mapFiltersToPrisma<
      UserListQueryProps,
      PrismaUserWhereInput
    >(filtersOptions, userListFilterMapper);

    const [total_items, usersList] = await Promise.all([
      this.ormClient.user.count({ where: customWhere }),
      this.ormClient.user.findMany({
        where: customWhere,
        skip: (custom_current_page - 1) * custom_current_page_size,
        take: custom_current_page_size,
        orderBy: { [order_by || "name"]: order },
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

export { AdminRepositoryPrisma };
