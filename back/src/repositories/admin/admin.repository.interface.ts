import { User } from "../../entities/user";

export interface AdminRepositoryInterface {
  create(user: User): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
