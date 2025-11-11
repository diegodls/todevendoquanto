import { UserListRequestPaginatedQuery } from "@/application/dtos/admin/user-list-dto";
import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";
import { User } from "@/core/entities/user";
import { AuthenticatedControllerInterface } from "@/core/usecases/authenticated-controller-interface";

export type UserListControllerType = AuthenticatedControllerInterface<
  UserListRequestPaginatedQuery,
  {},
  {},
  {},
  PaginatedResponse<User>
>;
