import {
  ListUsersControllerFilters,
  PaginationInputDTO,
  PaginationOutputDTO,
} from "@/application/dtos/shared/PaginationDTO";
import { User } from "@/core/domain/User";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";

type IUserListController = IAuthenticatedController<
  PaginationInputDTO<User, ListUsersControllerFilters>,
  {},
  {},
  {},
  PaginationOutputDTO<User>
>;

export { IUserListController };
