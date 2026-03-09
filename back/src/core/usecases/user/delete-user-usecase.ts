import { UserId } from "@/core/entities/user/value-objects/user-id";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  InternalError,
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/errors/api-errors";
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
    let requestingUserId = UserId.from(data.requestingUserId);

    const requestingUser = await this.repository.findById(requestingUserId);

    if (!requestingUser) {
      throw new NotFoundError("User not found");
    }

    const targetUserId = UserId.from(data.targetUserId);

    const targetUser = await this.repository.findById(targetUserId);

    if (!targetUser) {
      throw new NotFoundError("User not found");
    }

    const isSelfDelete = requestingUser.id.equals(targetUser.id);
    const isAdmin = requestingUser.isAdmin();

    if (!isSelfDelete && !isAdmin) {
      throw new UnauthorizedError("Only admins can delete other users");
    }

    if (isSelfDelete && isAdmin) {
      throw new UnauthorizedError("Only admins can delete other admins");
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
