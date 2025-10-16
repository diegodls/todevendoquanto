import { PaginatedResponse } from "@/application/dtos/shared/PaginationDTO";
import { User } from "@/core/domain/User";
import { ListUsersControllerPaginationInput } from "@/core/usecases/authenticated/user/IUserListController";

interface IAdminRepository {
  findUserById(id: User["id"]): Promise<User | null>;
  deleteUserById(id: User["id"]): Promise<User | null>;
  listUsers(
    input: ListUsersControllerPaginationInput
  ): Promise<PaginatedResponse<User>>;
}

export { IAdminRepository };
