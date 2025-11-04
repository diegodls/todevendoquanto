import { UserListRequestDTO } from "@/application/dtos/admin/UserListDTO";
import { PaginatedResponse } from "@/application/dtos/shared/PaginationDTO";
import { User } from "@/core/domain/User";

export interface IAdminRepository {
  findUserById(id: User["id"]): Promise<User | null>;
  deleteUserById(id: User["id"]): Promise<User | null>;
  listUsers(input: UserListRequestDTO): Promise<PaginatedResponse<User>>;
}
