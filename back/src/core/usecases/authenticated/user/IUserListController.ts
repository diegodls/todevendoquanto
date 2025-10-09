import {
  PaginationInputDTO,
  PaginationOutputDTO,
} from "@/application/dtos/shared/PaginationDTO";
import {
  User,
  UserValidPropsToFilter,
  UserValidPropsToOrderBy,
} from "@/core/domain/User";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";

type ListUsersControllerFilters = UserValidPropsToFilter;

type ListUsersControllerPaginationInput = PaginationInputDTO<
  UserValidPropsToOrderBy,
  ListUsersControllerFilters
>;

type IUserListController = IAuthenticatedController<
  ListUsersControllerPaginationInput,
  {},
  {},
  {},
  PaginationOutputDTO<User>
>;

export {
  IUserListController,
  ListUsersControllerFilters,
  ListUsersControllerPaginationInput,
};
