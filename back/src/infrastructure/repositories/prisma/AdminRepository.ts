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

    const custom_current_page = input.page || 1;

    const custom_current_page_size = input.page_size || 10;

    let custom_current_order_by: GenericOrderBy<Omit<User, "password">> = {
      name: "asc",
    };

    // ! TODO: RETURN THE REAL AMOUNT OF PAGES(AND THE META CHOSEN BY USER) AND ITEMS, HAS_PREVIOUS_PAGE(BOOLEAN) AND HAS_NEXT_PAGE(BOOLEAN) IN CASE OF ERROR

    // ! TODO: VALIDATE ON ZOD IF "X" PROPS WAS SEND (ex: input.name, input.order_by [password, and on...]) TO PREVENT THE VERIFICATIONS (if's) BELLOW, PASS THE FULL VALIDATED INPUT.XXX FROM ZOD

    // ? PAREI AQUI, TEM QUE FAZER O has_previous_page E OS ITENS ACIMA ^

    if (input.order_by && !input.order_by.password) {
      custom_current_order_by = input.order_by;
    }

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

    const [total_items, usersList] = await Promise.all([
      this.ormClient.user.count({ where: customWhere }),
      this.ormClient.user.findMany({
        where: customWhere,
        skip: (custom_current_page - 1) * custom_current_page_size,
        take: custom_current_page_size,
        orderBy: custom_current_order_by,
      }),
    ]);

    const total_pages = Math.ceil(total_items / custom_current_page_size);

    let output: PaginationOutputDTO<User> = {
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

export { AdminRepository };
