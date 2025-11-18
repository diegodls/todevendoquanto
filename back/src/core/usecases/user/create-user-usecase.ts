import { User } from "@/core/entities/user";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  AlreadyExistError,
  InternalError,
} from "@/core/shared/utils/errors/api-error";
import { userServiceErrorCodes } from "@/core/shared/utils/errors/codes/user/user-error-codes";
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

    if (!encryptedPassword) {
      throw new InternalError(
        "Internal Server Error!",
        {},
        userServiceErrorCodes.E_0_SVC_USR_0002.code
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
