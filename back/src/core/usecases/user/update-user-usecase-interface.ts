import {
  UpdateUserInputDTO,
  UpdateUserOutputDTO,
} from "@/application/dtos/user/update-dto";
import { User } from "@/core/entities/user";
import { JwtPayloadInterface } from "@/core/ports/infrastructure/auth/jwt-auth-interface";

export interface UpdateUserUseCaseInterface {
  execute(
    loggedUser: JwtPayloadInterface,
    targetUserID: User["id"],
    data: UpdateUserInputDTO
  ): Promise<UpdateUserOutputDTO | null>;
}
