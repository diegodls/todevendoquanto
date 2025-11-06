import {
  UserDeleteByIDInputDTO,
  UserDeleteByIDOutputDTO,
} from "@/application/dtos/user/user-delete-dto";
import { AuthenticatedControllerInterface } from "@/core/usecases/authenticated-controller-interface";

export type UserDeleteByIDControllerType = AuthenticatedControllerInterface<
  UserDeleteByIDInputDTO,
  {},
  {},
  {},
  UserDeleteByIDOutputDTO
>;
