import { UserUpdateInputDTO } from "@/application/dtos/user/UserUpdateDTO";
import { User } from "@/core/domain/User";
import { IJwtPayload } from "@/core/ports/infrastructure/auth/IJWTAuth";

export interface IUserRepository {
  findByID(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User | null>;
  update(user: IJwtPayload, data: UserUpdateInputDTO): Promise<User | null>;
}
