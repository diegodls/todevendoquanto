import { PaginatedResponse } from "@/application/dtos/shared/PaginationDTO";
import { User } from "@/core/domain/User";
import { ListUsersControllerPaginationInput } from "@/core/usecases/authenticated/user/IUserListController";

interface IAdminService {
  deleteUserById(
    adminId: User["id"],
    idToDelete: User["id"]
  ): Promise<User | null>;

  listUsers(
    adminId: User["id"],
    input: ListUsersControllerPaginationInput
  ): Promise<PaginatedResponse<User>>;
}

export { IAdminService };
