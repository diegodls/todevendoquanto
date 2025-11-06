import {
  UserUpdateInputDTO,
  UserUpdateParams,
  UserUpdateOutputDTO,
} from "@/application/dtos/user/user-update-dto";
import { AuthenticatedControllerInterface } from "@/core/usecases/authenticated-controller-interface";

export type UserUpdateControllerType = AuthenticatedControllerInterface<
  UserUpdateInputDTO,
  {},
  UserUpdateParams,
  {},
  UserUpdateOutputDTO
>;
