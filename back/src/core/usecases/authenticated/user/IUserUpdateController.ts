import {
  UserUpdateInputDTO,
  UserUpdateOutputDTO,
  UserUpdateParams,
} from "@/application/dtos/user/UserUpdateDTO";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";

type IUserUpdateController = IAuthenticatedController<
  UserUpdateInputDTO,
  {},
  UserUpdateParams,
  {},
  UserUpdateOutputDTO
>;

export { IUserUpdateController };
