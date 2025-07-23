import { User } from "../../core/domain/User";

interface IAdminService {
  deleteUserById(
    adminId: User["id"],
    idToDelete: User["id"]
  ): Promise<User | null>;
}

export { IAdminService };
