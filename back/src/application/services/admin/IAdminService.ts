import { UserListRequestDTO } from "@/application/dtos/admin/UserListDTO";
import { PaginatedResponse } from "@/application/dtos/shared/PaginationDTO";
import { User } from "@/core/domain/User";

export interface IAdminService {
  deleteUserById(
    adminId: User["id"],
    idToDelete: User["id"]
  ): Promise<User | null>;

  listUsers(
    adminId: User["id"],
    input: UserListRequestDTO
  ): Promise<PaginatedResponse<User>>;
}
