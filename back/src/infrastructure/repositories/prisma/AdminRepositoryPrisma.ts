import { UserListRequestDTO } from "@/application/dtos/admin/UserListDTO";
import { PaginatedResponse } from "@/application/dtos/shared/PaginationDTO";
import { User } from "@/core/domain/User";
import { IAdminRepository } from "@/core/ports/repositories/IAdminRepository";
import {
  PrismaClientGenerated,
  PrismaGenerated,
} from "@/core/shared/utils/orm/prisma/prismaClient";
import { prismaEntityUserParser } from "@/core/shared/utils/orm/prisma/prismaEntityUserParser";
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
    let customWhere: PrismaGenerated.UserWhereInput = {};

    const custom_current_page = input.page || 1;

    const custom_current_page_size = input.page_size || 10;

    if (input.name) {
      customWhere.name = {
        contains: input.name,
        mode: "insensitive",
      };
    }

    if (input.email) {
      customWhere.email = {
        contains: input.email,
        mode: "insensitive",
      };
    }

    if (input.role) {
      customWhere.role = input.role;
    }

    if (input.created_at) {
      customWhere.created_at = input.created_at;
    }

    if (input.updated_at) {
      customWhere.updated_at = input.updated_at;
    }

    if (input.is_active !== undefined) {
      customWhere.is_active = input.is_active;
    }

    const [total_items, usersList] = await Promise.all([
      this.ormClient.user.count({ where: customWhere }),
      this.ormClient.user.findMany({
        where: customWhere,
        skip: (custom_current_page - 1) * custom_current_page_size,
        take: custom_current_page_size,
        orderBy: { [input.order_by]: input.order },
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
