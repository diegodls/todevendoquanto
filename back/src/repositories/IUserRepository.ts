import { User } from "../core/domain/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User | null>;
}
