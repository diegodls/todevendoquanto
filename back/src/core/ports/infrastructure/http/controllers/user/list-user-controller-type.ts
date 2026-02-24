import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";
import {
  ListUserOutputDTO,
  ListUsersPaginatedQueryParams,
} from "@/core/usecases/user/list-user-dto";

export type UserListControllerType = AuthenticatedControllerInterface<
  ListUsersPaginatedQueryParams,
  {},
  {},
  {},
  ListUserOutputDTO
>;
