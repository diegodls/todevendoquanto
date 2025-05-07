import { User } from "../../entities/user";

export interface UserRepositoryInterface {
  findByEmail(email: string): Promise<User | null>;
}
