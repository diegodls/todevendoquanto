import {
  PaginatedResponse,
  PaginationProps,
} from "@/application/dtos/shared/pagination-dto";
import { User } from "@/core/entities/user/user";
import { Email } from "@/core/entities/user/value-objects/user-email";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import {
  ListUserOrderProps,
  ListUsersFilterProps,
} from "@/core/usecases/user/list-user-dto";

export interface UserRepositoryInterface {
  list(
    filters: ListUsersFilterProps,
    order: ListUserOrderProps,
    pagination: PaginationProps,
    sort: ListUserOrderProps,
  ): Promise<PaginatedResponse<User>>;
  findByEmail(email: Email): Promise<User | null>;
  findByName(name: User["name"]): Promise<User | null>;
  findById(id: UserId): Promise<User | null>;
  deleteById(id: UserId): Promise<User | null>;
  create(user: User): Promise<User | null>;
  update(user: User): Promise<User | null>;
}
