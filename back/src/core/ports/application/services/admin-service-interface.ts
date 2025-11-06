import { UserListRequestDTO } from "@/application/dtos/admin/user-list-dto";
import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";
import { User } from "@/core/domain/user";

export interface AdminServiceInterface {
  deleteUserById(
    adminId: User["id"],
    idToDelete: User["id"]
  ): Promise<User | null>;

  listUsers(
    adminId: User["id"],
    input: UserListRequestDTO
  ): Promise<PaginatedResponse<User>>;
}
