import { UserId } from "@/core/entities/user/value-objects/user-id";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  InternalError,
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/errors/api-errors";
import { useCasesErrors } from "@/core/shared/errors/usecases/user-usecase-errors";
import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDOutputDTO,
} from "@/core/usecases/user/delete-user-dto";

import { DeleteUserUseCaseInterface } from "@/core/usecases/user/delete-user-usecase-interface";

export class DeleteUserUseCase implements DeleteUserUseCaseInterface {
  constructor(private readonly repository: UserRepositoryInterface) {}

  public async execute(
    data: DeleteUserByIDInputDTO,
  ): Promise<DeleteUserByIDOutputDTO> {
    const requestingUserId = UserId.from(data.requestingUserId);

    const requestingUser = await this.repository.findById(requestingUserId);

    const targetUserId = UserId.from(data.targetUserId);

    const targetUser = await this.repository.findById(targetUserId);

    if (!targetUser) {
      throw new NotFoundError(
        "User not found",
        {},
        useCasesErrors.E_0_USC_USR_0008.code,
      );
    }

    if (!targetUser.role.canDeleteContent()) {
      throw new UnauthorizedError(
        "You cannot perform this action",
        {},
        useCasesErrors.E_0_USC_USR_0009.code,
      );
    }

    const deletedUser = await this.repository.deleteById(targetUserId);

    if (!deletedUser) {
      throw new InternalError("Wasn't possible to delete user");
    }

    const output = {
      id: deletedUser.id.toString(),
    };

    return output;
  }
}
