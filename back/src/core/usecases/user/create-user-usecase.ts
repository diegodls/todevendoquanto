import { User } from "@/core/entities/user";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  AlreadyExistError,
  InternalError,
} from "@/core/shared/errors/api-errors";
import { useCasesErrorsCodes } from "@/core/shared/errors/usecases/user-usecase-errors";
import { CreateUserInputDTO } from "@/core/usecases/user/create-user-dto";
import { CreateUserUseCaseInterface } from "@/core/usecases/user/create-user-usecase-interface";

import bcrypt from "bcrypt";

export class CreateUserUseCase implements CreateUserUseCaseInterface {
  constructor(private readonly repository: UserRepositoryInterface) {}

  public async execute(data: CreateUserInputDTO): Promise<User | null> {
    const { name, email, password } = data;

    const userAlreadyExists = await this.repository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AlreadyExistError("User already exists with given email");
    }

    const saltRounds = 10;

    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    // TODO: remover o bcrypt lá para o auth/encrypt/decrypt e passar pra cá junto ao "repository"

    if (!encryptedPassword) {
      throw new InternalError(
        "Internal Server Error!",
        {},
        useCasesErrorsCodes.E_0_USC_USR_0002.code
      );
    }

    const userToBeCreated = new User({
      name,
      email,
      password: encryptedPassword,
    });

    return await this.repository.create(userToBeCreated);
  }
}
