import { UserUpdateInputDTO } from "@/application/dtos/user/user-update-dto";
import { User } from "@/core/domain/user";

export interface UserRepositoryInterface {
  findByID(id: User["id"]): Promise<User | null>;
  findByEmail(email: User["email"]): Promise<User | null>;
  findByName(name: User["name"]): Promise<User | null>;
  create(user: User): Promise<User | null>;
  update(id: User["id"], data: UserUpdateInputDTO): Promise<User | null>;
}
