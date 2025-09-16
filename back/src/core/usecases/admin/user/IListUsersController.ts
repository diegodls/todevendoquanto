import {
  ListUsersControllerFilters,
  PaginationInputDTO,
  PaginationOutputDTO,
} from "@/application/dtos/PaginationDTO";
import { User } from "@/core/domain/User";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";

type IListUsersController = IAuthenticatedController<
  PaginationInputDTO<User, ListUsersControllerFilters>,
  {},
  {},
  {},
  PaginationOutputDTO<User>
>;

export { IListUsersController };
