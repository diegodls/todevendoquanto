import { ListUsersRequestDTO } from "@/application/dtos/admin/list-dto";
import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";
import { UpdateUserInputDTO } from "@/application/dtos/user/update-dto";
import { User } from "@/core/entities/user";

export interface UserRepositoryInterface {
  list(filters: ListUsersRequestDTO): Promise<PaginatedResponse<User>>;
  findByEmail(email: User["email"]): Promise<User | null>;
  findByName(name: User["name"]): Promise<User | null>;
  findById(id: User["id"]): Promise<User | null>;
  deleteById(id: User["id"]): Promise<User | null>;
  create(user: User): Promise<User | null>;
  update(id: User["id"], data: UpdateUserInputDTO): Promise<User | null>;
}
