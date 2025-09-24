import {
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "@/application/dtos/user/UserLoginDTO";
import { UserSignInInputDTO } from "@/application/dtos/user/UserSignInDTO";
import { User } from "@/core/domain/User";

interface IUserService {
  create(data: UserSignInInputDTO): Promise<User | null>;
  login(data: UserLoginInputDTO): Promise<UserLoginOutputDTO>;
}

export { IUserService };
