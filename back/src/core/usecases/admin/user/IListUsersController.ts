import {
  ListUsersInputDTO,
  ListUsersOutputDTO,
} from "@/application/dtos/ListUsersDTO";
import { AuthenticatedController } from "@/core/usecases/AuthenticatedController";

type IListUsersController = AuthenticatedController<
  ListUsersInputDTO,
  {},
  {},
  {},
  ListUsersOutputDTO
>;

export { IListUsersController };
