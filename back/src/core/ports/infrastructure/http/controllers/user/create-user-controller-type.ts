import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";
import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "@/core/usecases/user/create-user-dto";

export type CreateUserControllerInterface = AuthenticatedControllerInterface<
  CreateUserInputDTO,
  {},
  {},
  {},
  CreateUserOutputDTO
>;
