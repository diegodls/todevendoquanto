import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";
import { User } from "@/core/entities/user";
import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";
import { UserListRequestPaginatedQuery } from "@/core/usecases/user/list-user-dto";

export type UserListControllerType = AuthenticatedControllerInterface<
  UserListRequestPaginatedQuery,
  {},
  {},
  {},
  PaginatedResponse<User>
>;
