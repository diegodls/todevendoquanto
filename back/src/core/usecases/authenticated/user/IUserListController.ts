import { UserListRequestPaginatedQuery } from "@/application/dtos/admin/UserListDTO";
import { PaginatedResponse } from "@/application/dtos/shared/PaginationDTO";
import { User } from "@/core/domain/User";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";

export type IUserListController = IAuthenticatedController<
  UserListRequestPaginatedQuery,
  {},
  {},
  {},
  PaginatedResponse<User>
>;
