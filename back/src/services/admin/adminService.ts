import { User } from "../../entities/User";
import { IAdminRepository } from "../../repositories/IAdminRepository";
import { NotFoundError, UnauthorizedError } from "../../utils/errors/ApiError";
import { adminServiceErrorCodes } from "../../utils/errors/codes/admin/adminErrorCodes";
import { IAdminService } from "./iAdminService";

class AdminService implements IAdminService {
  constructor(private readonly repository: IAdminRepository) {}

  public async deleteUserById(
    adminId: User["id"],
    idToDelete: User["id"]
  ): Promise<void> {
    console.log("");
    console.log(`AdminService > Searching Admin with ID: ${adminId}...`);

    const userAdmin = await this.repository.findUserById(adminId);

    if (!userAdmin) {
      console.log(`AdminService > Admin with ID: ${adminId} was not found!`);
      throw new UnauthorizedError(
        "Invalid Credentials",
        {},
        adminServiceErrorCodes.E_0_SVC_ADM_0001.code
      );
    }

    if (userAdmin.role !== "ADMIN") {
      console.log(
        `AdminService > Admin with ID: ${adminId} doesn't have admin privileges`
      );
      throw new UnauthorizedError(
        "You don't have the right permissions.",
        {},
        adminServiceErrorCodes.E_0_SVC_ADM_0002.code
      );
    }

    const userToDelete = await this.repository.findUserById(idToDelete);

    if (!userToDelete) {
      console.log(
        `AdminService > User to delete with ID: ${idToDelete} was not found!`
      );
      throw new NotFoundError(
        "ID to be deleted was not found!",
        {},
        adminServiceErrorCodes.E_0_SVC_ADM_0003.code
      );
    }

    if (userToDelete.role === "ADMIN") {
      console.log(`AdminService > Can't delete another Admin`);
      console.log(`${adminId} ⚔️ ${idToDelete}`);
      throw new UnauthorizedError(
        "You can't delete another ADMIN USER.",
        {},
        adminServiceErrorCodes.E_0_SVC_ADM_0004.code
      );
    }

    const output = this.repository.deleteUserById(idToDelete);
  }
}

export { AdminService };
