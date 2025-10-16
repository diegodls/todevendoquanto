import { UserListRequestPaginatedQuery } from "@/application/dtos/admin/UserListDTO";
import { PaginatedResponse } from "@/application/dtos/shared/PaginationDTO";
import { User } from "@/core/domain/User";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";

type IUserListController = IAuthenticatedController<
  UserListRequestPaginatedQuery,
  {},
  {},
  {},
  PaginatedResponse<User>
>;

export { IUserListController };
