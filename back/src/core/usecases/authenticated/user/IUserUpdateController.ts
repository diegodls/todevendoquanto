import {
  UserUpdateInputDTO,
  UserUpdateOutputDTO,
  UserUpdateParams,
} from "@/application/dtos/user/UserUpdateDTO";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";

export type IUserUpdateController = IAuthenticatedController<
  UserUpdateInputDTO,
  {},
  UserUpdateParams,
  {},
  UserUpdateOutputDTO
>;
