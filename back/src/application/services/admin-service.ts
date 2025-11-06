import { UserListRequestDTO } from "@/application/dtos/admin/user-list-dto";
import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";
import { User } from "@/core/domain/user";
import { AdminServiceInterface } from "@/core/ports/application/services/admin-service-interface";
import { AdminRepositoryInterface } from "@/core/ports/repositories/admin-repository-interface";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/utils/errors/api-error";
import { adminServiceErrorCodes } from "@/core/shared/utils/errors/codes/admin/admin-error-codes";

export class AdminService implements AdminServiceInterface {
  constructor(private readonly repository: AdminRepositoryInterface) {}

  private async isAdmin(id: User["id"]) {
    const currentAdminUser = await this.repository.findUserById(id);

    if (!currentAdminUser) {
      throw new UnauthorizedError(
        "Invalid Credentials",
        {},
        adminServiceErrorCodes.E_0_SVC_ADM_0001.code
      );
    }

    if (currentAdminUser.role !== "ADMIN") {
      throw new UnauthorizedError(
        "You don't have the right permissions.",
        {},
        adminServiceErrorCodes.E_0_SVC_ADM_0002.code
      );
    }
  }

  public async deleteUserById(
    adminId: User["id"],
    idToDelete: User["id"]
  ): Promise<User | null> {
    this.isAdmin(adminId);

    const userToBeDeleted = await this.repository.findUserById(idToDelete);

    if (!userToBeDeleted) {
      throw new NotFoundError(
        "User not found",
        {},
        adminServiceErrorCodes.E_0_SVC_ADM_0003.code
      );
    }

    if (userToBeDeleted.role === "ADMIN") {
      throw new UnauthorizedError(
        "You cannot performe this action",
        {},
        adminServiceErrorCodes.E_0_SVC_ADM_0004.code
      );
    }

    const output = await this.repository.deleteUserById(idToDelete);

    return output;
  }

  public async listUsers(
    adminId: User["id"],
    input: UserListRequestDTO
  ): Promise<PaginatedResponse<User>> {
    this.isAdmin(adminId);

    const output = await this.repository.listUsers(input);

    return output;
  }
}
