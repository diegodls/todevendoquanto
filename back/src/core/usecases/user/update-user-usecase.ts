import { User } from "@/core/entities/user/user";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import { UserRole } from "@/core/entities/user/value-objects/user-role";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  InternalError,
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/errors/api-errors";
import { useCasesErrors } from "@/core/shared/errors/usecases/user-usecase-errors";
import {
  UpdateUserInputDTO,
  UpdateUserOutputDTO,
} from "@/core/usecases/user/update-user-dto";
import { UpdateUserUseCaseInterface } from "@/core/usecases/user/update-user-usecase-interface";

export class UpdateUserUseCase implements UpdateUserUseCaseInterface {
  constructor(private readonly repository: UserRepositoryInterface) {}

  public async execute(data: UpdateUserInputDTO): Promise<UpdateUserOutputDTO> {
    const requestingUserId: UserId = UserId.from(data.requestingUserId);

    const requestingUser: User | null =
      await this.repository.findById(requestingUserId);

    if (!requestingUser) {
      throw new NotFoundError(
        "Requesting user not found",
        {},
        useCasesErrors.E_0_USC_USR_0003.code,
      );
    }

    const targetUserId: UserId = UserId.from(data.targetUserId);

    const targetUser: User | null =
      await this.repository.findById(targetUserId);

    if (!targetUser) {
      throw new NotFoundError(
        "The user to be updated was not found with given ID!",
      );
    }

    const hasBeenModified: boolean = this.applyUpdates(
      requestingUser,
      targetUser,
      data,
    );

    let output: UpdateUserOutputDTO = {
      id: targetUser?.id.toString(),
      name: targetUser.name,
      email: targetUser.email.toString(),
      role: targetUser.role.toString(),
      createdAt: targetUser.createdAt.toISOString(),
      updatedAt: targetUser.updatedAt.toISOString(),
      isActive: targetUser.isActive,
    };

    if (!hasBeenModified) {
      return output;
    }

    const updatedUser = await this.repository.update(targetUser);

    if (!updatedUser) {
      throw new InternalError("User no modified, try again later");
    }

    return output;
  }

  private applyUpdates(
    requestingUser: User,
    targetUser: User,
    data: UpdateUserInputDTO,
  ): boolean {
    let hasBeenModified: boolean = false;

    const isSelfUpdate = requestingUser.id.equals(targetUser.id);
    const isAdmin = requestingUser.isAdmin();

    if (!isSelfUpdate && !isAdmin) {
      throw new UnauthorizedError("Only admins can update other users info");
    }

    if (data.name !== undefined) {
      targetUser.changeName(data.name);
      hasBeenModified = true;
    }

    if (data.email !== undefined) {
      if (!isAdmin) {
        throw new UnauthorizedError("Only admins can update email");
      }
      targetUser.changeEmail(data.email);
      hasBeenModified = true;
    }

    if (data.role !== undefined) {
      if (!isAdmin) {
        throw new UnauthorizedError("Only admins can update role");
      }

      const newRole = UserRole.create(data.role);

      if (newRole.isAdmin()) {
        targetUser.promoteToAdmin();
        hasBeenModified = true;
      } else if (newRole.isBasic()) {
        targetUser.demoteToBasic();
        hasBeenModified = true;
      }
    }

    if (data.isActive !== undefined) {
      if (!isAdmin) {
        throw new UnauthorizedError(
          "Only admins can activate/deactivate users",
        );
      }

      if (data.isActive && !targetUser.isActive) {
        targetUser.activate();
        hasBeenModified = true;
      } else if (!data.isActive && targetUser.isActive) {
        targetUser.deactivate();
        hasBeenModified = true;
      }
    }

    if (isSelfUpdate && data.isActive === false && isAdmin) {
      throw new UnauthorizedError("Admins cannot deactivate themselves");
    }

    if (isSelfUpdate && data.role === "BASIC" && isAdmin) {
      throw new UnauthorizedError("Admins cannot demote themselves");
    }
    return hasBeenModified;
  }
}
