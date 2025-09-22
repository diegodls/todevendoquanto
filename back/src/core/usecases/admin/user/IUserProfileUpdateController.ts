import { UserProfileUpdateInputDTO } from "@/application/dtos/UserProfileUpdateDTO";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";

type IUserProfileUpdateController = IAuthenticatedController<
  UserProfileUpdateInputDTO,
  {},
  {},
  {},
  {}
>;

export { IUserProfileUpdateController };
