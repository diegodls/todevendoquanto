import {
  UserUpdateInputDTO,
  UserUpdateOutputDTO,
} from "@/application/dtos/user/UserUpdateDTO";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";

type IUserUpdateController = IAuthenticatedController<
  UserUpdateInputDTO,
  {},
  {},
  {},
  UserUpdateOutputDTO
>;

export { IUserUpdateController };
