import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";
import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDOutputDTO,
} from "@/core/usecases/user/delete-user-dto";

export type DeleteUserByIDControllerType = AuthenticatedControllerInterface<
  DeleteUserByIDInputDTO,
  {},
  {},
  {},
  DeleteUserByIDOutputDTO
>;
