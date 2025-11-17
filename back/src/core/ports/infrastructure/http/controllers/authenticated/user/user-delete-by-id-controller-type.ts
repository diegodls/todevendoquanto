import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDOutputDTO,
} from "@/application/dtos/user/delete-dto";
import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";

export type UserDeleteByIDControllerType = AuthenticatedControllerInterface<
  DeleteUserByIDInputDTO,
  {},
  {},
  {},
  DeleteUserByIDOutputDTO
>;
