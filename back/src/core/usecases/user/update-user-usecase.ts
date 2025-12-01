import { User } from "@/core/entities/user";
import { JwtPayloadInterface } from "@/core/ports/infrastructure/jwt/jwt-verify-token-interface";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  BadRequestError,
  NotModifiedError,
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

  public async execute(
    loggedUserJWT: JwtPayloadInterface,
    targetUserID: User["id"],
    data: UpdateUserInputDTO
  ): Promise<UpdateUserOutputDTO | null> {
    const loggedUser: User | null = await this.repository.findById(
      loggedUserJWT.sub
    );

    if (!loggedUser) {
      throw new UnauthorizedError(
        "Invalid authentication: user not found!",
        {},
        useCasesErrors.E_0_USC_USR_0003.code
      );
    }

    const isLoggedUserAdmin: boolean = loggedUser.role === "ADMIN";

    if (!isLoggedUserAdmin) {
      delete data.role;
      delete data.isActive;
    }

    const targetUser: User | null = await this.repository.findById(
      targetUserID
    );

    if (!targetUser) {
      throw new BadRequestError(
        "The user to be updated was not found with given ID!"
      );
    }

    if (!isLoggedUserAdmin && loggedUser.id !== targetUser.id) {
      throw new UnauthorizedError(
        "You don't have the permissions",
        {},
        useCasesErrors.E_0_USC_USR_0004.code
      );
    }

    const sanitizedData = this.sanitizeData(loggedUser, targetUser, data);

    await this.validateUniqueFields(targetUser, sanitizedData);

    if (Object.keys(sanitizedData).length <= 0) {
      throw new NotModifiedError();
    }

    const updatedUser = await this.repository.update(
      targetUserID,
      sanitizedData
    );

    const output = updatedUser ? { ...updatedUser, password: "" } : null;

    return output;
  }

  private sanitizeData(
    loggedUser: User,
    targetUser: User,
    data: UpdateUserInputDTO
  ): UpdateUserInputDTO {
    const sanitizedData: UpdateUserInputDTO = { ...data };

    const isAdmin = loggedUser.role === "ADMIN";

    if (!isAdmin) {
      delete sanitizedData.role;
      delete sanitizedData.isActive;
    }

    if (targetUser.email === sanitizedData?.email) {
      delete sanitizedData.email;
    }

    if (targetUser.name === sanitizedData?.name) {
      delete sanitizedData.name;
    }

    return sanitizedData;
  }

  private async validateUniqueFields(
    targetUser: User,
    data: UpdateUserInputDTO
  ): Promise<void> {
    if (data?.name && data.name !== targetUser.name) {
      const userToChangeExists = await this.repository.findByName(data.name);

      if (userToChangeExists) {
        throw new BadRequestError(
          "Name already in use",
          { name: "Name already in use" },
          useCasesErrors.E_0_USC_USR_0005.code
        );
      }
    }

    if (data?.email && data.email !== targetUser.email) {
      const userToChangeExists = await this.repository.findByEmail(data.email);

      if (userToChangeExists) {
        throw new BadRequestError(
          "Email already in use",
          { email: "Email already in use" },
          useCasesErrors.E_0_USC_USR_0005.code
        );
      }
    }
  }
}
