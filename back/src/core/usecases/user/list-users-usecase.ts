import { PaginationDTO } from "@/application/dtos/shared/pagination-dto";
import { Email } from "@/core/entities/user/value-objects/user-email";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import { UserRole } from "@/core/entities/user/value-objects/user-role";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/errors/api-errors";
import {
  ListUserOutputDTO,
  ListUsersFiltersOptions,
  ListUsersInputDTO,
  ListUsersOrderRequestProps,
} from "@/core/usecases/user/list-user-dto";
import { ListUsersUseCaseInterface as ListUserUsesCaseInterface } from "@/core/usecases/user/list-users-usecase-interface";
import { ListUserOutputProps } from "./list-user-dto";

export class ListUsersUseCase implements ListUserUsesCaseInterface {
  constructor(private readonly repository: UserRepositoryInterface) {}

  public async execute(data: ListUsersInputDTO): Promise<ListUserOutputDTO> {
    const requestingUserId = UserId.from(data.requestingUserId);

    const requestingUser = await this.repository.findById(requestingUserId);

    if (!requestingUser) {
      throw new NotFoundError("User not found");
    }

    if (!requestingUser.isAdmin()) {
      throw new UnauthorizedError("Only admins can list users");
    }

    const filterProps: ListUsersFiltersOptions = this.buildFilters(data);

    const orderProps: ListUsersOrderRequestProps = this.buildOrder(data);

    const pagination: PaginationDTO = this.buildPagination(data);

    const repositoryData = await this.repository.list(
      filterProps,
      orderProps,
      pagination,
    );

    let userList: ListUserOutputProps[] = [];

    if (repositoryData.data.length > 0) {
      userList = repositoryData.data.map((user) => {
        return {
          id: user.id.toString(),
          name: user.name.toString(),
          email: user.email.toString(),
          role: user.role.toString(),
          isActive: user.isActive,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      });
    }

    const output: ListUserOutputDTO = {
      data: userList,
      meta: repositoryData.meta,
    };

    return output;
  }

  private buildFilters(data: ListUsersInputDTO): ListUsersFiltersOptions {
    const filters: ListUsersFiltersOptions = {};

    if (data.name !== undefined) {
      filters.name = data.name;
    }

    if (data.email !== undefined) {
      Email.create(data.email);
      filters.email = data.email;
    }

    if (data.roles !== undefined) {
      data.roles.map((role) => {
        UserRole.create(role);
        filters.roles?.push(role);
      });
    }

    if (data.isActive !== undefined) {
      filters.isActive = data.isActive;
    }

    if (data.created_after !== undefined) {
      filters.created_after = data.created_after;
    }

    if (data.created_before !== undefined) {
      filters.created_before = data.created_before;
    }

    if (data.updated_after !== undefined) {
      filters.updated_after = data.updated_after;
    }

    if (data.updated_before !== undefined) {
      filters.updated_before = data.updated_before;
    }

    return filters;
  }

  private buildOrder(data: ListUsersInputDTO): ListUsersOrderRequestProps {
    const order: ListUsersOrderRequestProps = {
      orderBy: "name",
      order: "asc",
    };

    order.order = data.order;

    order.orderBy = data.orderBy;

    return order;
  }

  private buildPagination(data: ListUsersInputDTO): PaginationDTO {
    const page = data.page && data.page > 0 ? data.page : 1;

    const pageSize = data.pageSize && data.pageSize > 0 ? data.pageSize : 10;

    return { page, pageSize };
  }
}
