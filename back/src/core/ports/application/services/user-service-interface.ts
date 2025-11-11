import {
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "@/application/dtos/user/user-login-dto";
import { UserSignInInputDTO } from "@/application/dtos/user/user-sign-in-dto";
import {
  UserUpdateInputDTO,
  UserUpdateOutputDTO,
} from "@/application/dtos/user/user-update-dto";
import { User } from "@/core/entities/user";
import { JwtPayloadInterface } from "@/core/ports/infrastructure/auth/jwt-auth-interface";

export interface UserServiceInterface {
  create(data: UserSignInInputDTO): Promise<User | null>;
  login(data: UserLoginInputDTO): Promise<UserLoginOutputDTO>;
  update(
    loggedUser: JwtPayloadInterface,
    targetUserID: User["id"],
    data: UserUpdateInputDTO
  ): Promise<UserUpdateOutputDTO | null>;
}
