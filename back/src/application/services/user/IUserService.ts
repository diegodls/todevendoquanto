import {
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "@/application/dtos/user/UserLoginDTO";
import { UserSignInInputDTO } from "@/application/dtos/user/UserSignInDTO";
import {
  UserUpdateInputDTO,
  UserUpdateOutputDTO,
} from "@/application/dtos/user/UserUpdateDTO";
import { User } from "@/core/domain/User";
import { IJwtPayload } from "@/core/ports/infrastructure/auth/IJWTAuth";

interface IUserService {
  create(data: UserSignInInputDTO): Promise<User | null>;
  login(data: UserLoginInputDTO): Promise<UserLoginOutputDTO>;
  update(
    userJWT: IJwtPayload,
    data: UserUpdateInputDTO
  ): Promise<UserUpdateOutputDTO | null>;
}

export { IUserService };
