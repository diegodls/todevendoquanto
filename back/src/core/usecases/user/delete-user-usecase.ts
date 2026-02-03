import { User } from "@/core/entities/user/user";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/errors/api-errors";
import { useCasesErrors } from "@/core/shared/errors/usecases/user-usecase-errors";

import { DeleteUserUseCaseInterface } from "@/core/usecases/user/delete-user-usecase-interface";

export class DeleteUserUseCase implements DeleteUserUseCaseInterface {
  constructor(private readonly repository: UserRepositoryInterface) {}

  public async execute(id: User["id"]): Promise<User | null> {
    const userToBeDeleted = await this.repository.findById(id);

    if (!userToBeDeleted) {
      throw new NotFoundError(
        "User not found",
        {},
        useCasesErrors.E_0_USC_USR_0008.code,
      );
    }

    if (userToBeDeleted.role === "ADMIN") {
      throw new UnauthorizedError(
        "You cannot perform this action",
        {},
        useCasesErrors.E_0_USC_USR_0009.code,
      );
    }

    const output = await this.repository.deleteById(id);

    return output;
  }
}
