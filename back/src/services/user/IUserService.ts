import {
  CreateUserInputDTO,
  User,
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "../../core/domain/User";

interface IUserService {
  create(data: CreateUserInputDTO): Promise<User | null>;
  login(data: UserLoginInputDTO): Promise<UserLoginOutputDTO>;
}

export { IUserService };
