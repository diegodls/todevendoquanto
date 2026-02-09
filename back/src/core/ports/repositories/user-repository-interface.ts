import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";
import { User } from "@/core/entities/user/user";
import { Email } from "@/core/entities/user/value-objects/user-email";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import { DeleteUserByIDOutputDTO } from "@/core/usecases/user/delete-user-dto";
import { ListUsersRequestDTO } from "@/core/usecases/user/list-user-dto";
import { UpdateUserInputDTO } from "@/core/usecases/user/update-user-dto";

export interface UserRepositoryInterface {
  list(filters: ListUsersRequestDTO): Promise<PaginatedResponse<User>>;
  findByEmail(email: Email): Promise<User | null>;
  findByName(name: User["name"]): Promise<User | null>;
  findById(id: UserId): Promise<User | null>;
  deleteById(id: UserId): Promise<DeleteUserByIDOutputDTO>;
  create(user: User): Promise<User | null>;
  update(id: UserId, data: UpdateUserInputDTO): Promise<User | null>;
}
