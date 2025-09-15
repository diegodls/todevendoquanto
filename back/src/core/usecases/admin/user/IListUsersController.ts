import {
  ListUsersControllerFilters,
  PaginationInputDTO,
  PaginationOutputDTO,
} from "@/application/dtos/PaginationDTO";
import { User } from "@/core/domain/User";
import { AuthenticatedController } from "@/core/usecases/AuthenticatedController";

type IListUsersController = AuthenticatedController<
  PaginationInputDTO<User, ListUsersControllerFilters>,
  {},
  {},
  {},
  PaginationOutputDTO<User>
>;

export { IListUsersController };
