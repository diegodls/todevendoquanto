import {
  CreateUserInputDTO,
  User,
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "../../entities/User";

interface IUserService {
  create(data: CreateUserInputDTO): Promise<User | null>;
  login(data: UserLoginInputDTO): Promise<UserLoginOutputDTO>;
}

export { IUserService };
