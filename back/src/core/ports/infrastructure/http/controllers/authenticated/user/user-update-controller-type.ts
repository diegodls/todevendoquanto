import {
  UpdateUserInputDTO,
  UpdateUserOutputDTO,
  UpdateUserParams,
} from "@/application/dtos/user/update-dto";
import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";

export type UserUpdateControllerType = AuthenticatedControllerInterface<
  UpdateUserInputDTO,
  {},
  UpdateUserParams,
  {},
  UpdateUserOutputDTO
>;
