import {
  UserDeleteByIDInputDTO,
  UserDeleteByIDOutputDTO,
} from "@/application/dtos/user/UserDeleteDTO";
import { IAuthenticatedController } from "@/core/usecases/IAuthenticatedController";

export type IUserDeleteByIDController = IAuthenticatedController<
  UserDeleteByIDInputDTO,
  {},
  {},
  {},
  UserDeleteByIDOutputDTO
>;
