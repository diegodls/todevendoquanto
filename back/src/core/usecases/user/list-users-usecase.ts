import { PaginationParams } from "@/application/dtos/shared/pagination-dto";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/errors/api-errors";
import {
  ListUserOutputDTO,
  ListUsersInputDTO,
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
PAREI AQUI, TEM QUE SEPARAR O FILTER/SORT/ETC... 
    const sortProps = data.

    const repositoryData = await this.repository.list(data);

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

  private buildPagination(data: ListUsersInputDTO): PaginationParams {
    const page = data.page && data.page > 0 ? data.page : 1;

    const pageSize = data.pageSize && data.pageSize > 0 ? data.pageSize : 10;

    return { page, pageSize };
  }
}
