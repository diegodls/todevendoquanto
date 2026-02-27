import { PaginationRequestProps } from "@/application/dtos/shared/pagination-dto";
import { User } from "@/core/entities/user/user";
import { Email } from "@/core/entities/user/value-objects/user-email";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import {
  ListUsersFiltersOptions,
  ListUsersOrderRequestOptionalProps,
} from "@/core/usecases/user/list-user-dto";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface UserRepositoryInterface {
  list(
    filters: ListUsersFiltersOptions,
    order: ListUsersOrderRequestOptionalProps,
    pagination: PaginationRequestProps,
  ): Promise<PaginatedResult<User>>;
  findByEmail(email: Email): Promise<User | null>;
  findByName(name: User["name"]): Promise<User | null>;
  findById(id: UserId): Promise<User | null>;
  deleteById(id: UserId): Promise<User | null>;
  create(user: User): Promise<User | null>;
  update(user: User): Promise<User | null>;
}
