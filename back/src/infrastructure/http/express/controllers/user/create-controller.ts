import { InternalError } from "@/core/shared/errors/api-errors";
import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "@/core/usecases/user/create-user-dto";
import { CreateUserUseCase } from "@/core/usecases/user/create-user-usecase";
import { userControllerErrorCodes } from "@/infrastructure/errors/codes/controllers/user/user-error-codes";
import { UserSignInBodySchema } from "@/infrastructure/validation/zod/schemas/user/user-sign-in-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/shared/validation/request-validation";
import { Request, Response } from "express";

export class CreateUserController {
  constructor(private readonly usecase: CreateUserUseCase) {}

  async handle(
    request: Request<{}, {}, CreateUserInputDTO>,
    response: Response<CreateUserOutputDTO | null>
  ): Promise<Response<CreateUserOutputDTO>> {
    const input = requestValidation("body", request, UserSignInBodySchema);

    const createdUser = await this.usecase.execute(input);

    if (!createdUser) {
      throw new InternalError(
        "Internal Server Error",
        {},
        userControllerErrorCodes.E_0_CTR_USR_0001.code
      );
    }

    const { password, ...userOutput } = createdUser;

    return response.status(200).json(userOutput);
  }
}
