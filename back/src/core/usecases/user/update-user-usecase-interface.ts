import { User } from "@/core/entities/user";
import { JwtPayloadInterface } from "@/core/ports/infrastructure/jwt/jwt-verify-token-interface";
import {
  UpdateUserInputDTO,
  UpdateUserOutputDTO,
} from "@/core/usecases/user/update-user-dto";

export interface UpdateUserUseCaseInterface {
  execute(
    loggedUser: JwtPayloadInterface,
    targetUserID: User["id"],
    data: UpdateUserInputDTO
  ): Promise<UpdateUserOutputDTO | null>;
}
