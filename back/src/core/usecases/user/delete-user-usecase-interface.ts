import { User } from "@/core/entities/user";

export interface DeleteUserUseCaseInterface {
  execute(id: User["id"]): Promise<User | null>;
}
