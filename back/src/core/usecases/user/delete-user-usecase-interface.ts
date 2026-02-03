import { User } from "@/core/entities/user/user";

export interface DeleteUserUseCaseInterface {
  execute(id: User["id"]): Promise<User | null>;
}
