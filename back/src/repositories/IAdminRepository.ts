import { User } from "../entities/User";

interface IAdminRepository {
  findUserById(id: User["id"]): Promise<User | null>;
  deleteUserById(id: User["id"]): Promise<User | null>;
}

export { IAdminRepository };
