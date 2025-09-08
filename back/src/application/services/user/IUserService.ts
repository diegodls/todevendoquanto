import {
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "@/application/dtos/UserLoginDTO";
import { UserSignInInputDTO } from "@/application/dtos/UserSignInDTO";
import { User } from "@/core/domain/User";

interface IUserService {
  create(data: UserSignInInputDTO): Promise<User | null>;
  login(data: UserLoginInputDTO): Promise<UserLoginOutputDTO>;
}

export { IUserService };
