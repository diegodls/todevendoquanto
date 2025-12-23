import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";
import { User } from "@/core/entities/user";
import { ListUsersRequestDTO } from "@/core/usecases/user/list-user-dto";

export interface ListUserUseCaseInterface {
  execute(filters: ListUsersRequestDTO): Promise<PaginatedResponse<User>>;
}
