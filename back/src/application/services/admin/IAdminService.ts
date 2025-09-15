import {
  ListUsersControllerFilters,
  PaginationInputDTO,
  PaginationOutputDTO,
} from "@/application/dtos/PaginationDTO";
import { User } from "@/core/domain/User";

interface IAdminService {
  deleteUserById(
    adminId: User["id"],
    idToDelete: User["id"]
  ): Promise<User | null>;

  listUsers(
    input: PaginationInputDTO<User, ListUsersControllerFilters>
  ): Promise<PaginationOutputDTO<User>>;
}

export { IAdminService };
