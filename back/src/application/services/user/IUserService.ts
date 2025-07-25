import { CreateUserInputDTO } from "@/application/dtos/CreateUserDTO";
import {
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "@/application/dtos/UserLoginDTO";
import { User } from "@/core/domain/User";

interface IUserService {
  create(data: CreateUserInputDTO): Promise<User | null>;
  login(data: UserLoginInputDTO): Promise<UserLoginOutputDTO>;
}

export { IUserService };
