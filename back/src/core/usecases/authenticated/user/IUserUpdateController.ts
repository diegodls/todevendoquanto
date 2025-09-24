import { UserUpdateInputDTO } from "@/application/dtos/user/UserUpdateDTO";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";

type IUserUpdateController = IAuthenticatedController<
  UserUpdateInputDTO,
  {},
  {},
  {},
  {}
>;

export { IUserUpdateController };
