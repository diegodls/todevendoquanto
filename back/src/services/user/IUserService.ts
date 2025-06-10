import { CreateUserInputDTO, User } from "../../entities/User";

interface IUserService {
  create(data: CreateUserInputDTO): Promise<User | null>;
}

export { IUserService };
