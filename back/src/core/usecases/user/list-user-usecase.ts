import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import { ListUsersRequestDTO } from "@/core/usecases/user/list-user-dto";
import { ListUserUseCaseInterface } from "@/core/usecases/user/list-user-usecase-interface";
import { User } from "@/prisma";

export class ListUserUseCase implements ListUserUseCaseInterface {
  constructor(private readonly repository: UserRepositoryInterface) {}

  public async execute(
    filters: ListUsersRequestDTO
  ): Promise<PaginatedResponse<User>> {
    const output = await this.repository.list(filters);

    return output;
  }
}
