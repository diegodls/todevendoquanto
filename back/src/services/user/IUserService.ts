import { CreateUserDTO, User } from "../../entities/User";

interface IUserService {
  create(data: CreateUserDTO): Promise<User | null>;
}

export { IUserService };
