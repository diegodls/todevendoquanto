import {
  ListUsersOutputDTO,
  PaginationInputDTO,
} from "@/application/dtos/PaginationDTO";
import { AuthenticatedController } from "@/core/usecases/AuthenticatedController";

type IListUsersController = AuthenticatedController<
  PaginationInputDTO,
  {},
  {},
  {},
  ListUsersOutputDTO
>;

export { IListUsersController };
