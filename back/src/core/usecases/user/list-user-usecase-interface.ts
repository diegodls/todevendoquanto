import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";
import { ListUsersRequestDTO } from "@/application/dtos/user/list-dto";
import { User } from "@/core/entities/user";

export interface ListUserUseCaseInterface {
  execute(filters: ListUsersRequestDTO): Promise<PaginatedResponse<User>>;
}
