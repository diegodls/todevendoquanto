import { IAdminRepository } from "@/core/ports/repositories/IAdminRepository";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/utils/errors/ApiError";
import { adminServiceErrorCodes } from "@/core/shared/utils/errors/codes/admin/adminErrorCodes";

import { PaginatedResponse } from "@/application/dtos/shared/PaginationDTO";
import { User } from "@/core/domain/User";
import { ListUsersControllerPaginationInput } from "@/core/usecases/authenticated/user/IUserListController";
import { IAdminService } from "./IAdminService";

class AdminService implements IAdminService {
  constructor(private readonly repository: IAdminRepository) {}

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
    input: ListUsersControllerPaginationInput
  ): Promise<PaginatedResponse<User>> {
    this.isAdmin(adminId);

    const output = await this.repository.listUsers(input);

    return output;
  }
}

export { AdminService };
