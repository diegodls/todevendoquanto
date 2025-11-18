import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";
import {
  UpdateUserInputDTO,
  UpdateUserOutputDTO,
  UpdateUserParams,
} from "@/core/usecases/user/update-user-dto";

export type UserUpdateControllerType = AuthenticatedControllerInterface<
  UpdateUserInputDTO,
  {},
  UpdateUserParams,
  {},
  UpdateUserOutputDTO
>;
