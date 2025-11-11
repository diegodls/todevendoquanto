import { UserListRequestDTO } from "@/application/dtos/admin/user-list-dto";
import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";

import { User } from "@/core/entities/user";

export interface AdminRepositoryInterface {
  findUserById(id: User["id"]): Promise<User | null>;
  deleteUserById(id: User["id"]): Promise<User | null>;
  listUsers(input: UserListRequestDTO): Promise<PaginatedResponse<User>>;
}
