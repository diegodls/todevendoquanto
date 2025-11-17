import { User } from "@/core/entities/user";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/utils/errors/api-error";
import { adminServiceErrorCodes } from "@/core/shared/utils/errors/codes/admin/admin-error-codes";
import { DeleteUserUseCaseInterface } from "@/core/usecases/user/delete-user-usecase-interface";

export class DeleteUserUseCase implements DeleteUserUseCaseInterface {
  constructor(private readonly repository: UserRepositoryInterface) {}

  public async execute(id: User["id"]): Promise<User | null> {
    const userToBeDeleted = await this.repository.findById(id);

    if (!userToBeDeleted) {
      throw new NotFoundError(
        "User not found",
        {},
        adminServiceErrorCodes.E_0_SVC_ADM_0003.code
      );
    }

    if (userToBeDeleted.role === "ADMIN") {
      throw new UnauthorizedError(
        "You cannot perform this action",
        {},
        adminServiceErrorCodes.E_0_SVC_ADM_0004.code
      );
    }

    const output = await this.repository.deleteById(id);

    return output;
  }
}
