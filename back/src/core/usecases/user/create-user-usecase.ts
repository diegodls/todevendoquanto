import { CreateUserProps, User } from "@/core/entities/user/user";
import { Password } from "@/core/entities/user/value-objects/password";
import { Email } from "@/core/entities/user/value-objects/user-email";
import { EncryptInterface } from "@/core/ports/infrastructure/protocols/encryption/encrypt-interface";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import { AlreadyExistError } from "@/core/shared/errors/api-errors";
import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "@/core/usecases/user/create-user-dto";
import { CreateUserUseCaseInterface } from "@/core/usecases/user/create-user-usecase-interface";

export class CreateUserUseCase implements CreateUserUseCaseInterface {
  constructor(
    private readonly repository: UserRepositoryInterface,
    private readonly encrypt: EncryptInterface,
  ) {}

  public async execute(data: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    const email = Email.create(data.email);

    const password = Password.create(data.password);

    const userWithNameExists = await this.repository.findByName(data.name);

    if (userWithNameExists) {
      throw new AlreadyExistError("User already exists with given name");
    }

    const userWithEmailExists = await this.repository.findByEmail(email);

    if (userWithEmailExists) {
      throw new AlreadyExistError("User already exists with given email");
    }

    const hashedPassword = await this.encrypt.execute(password.getValue());

    const props: CreateUserProps = {
      name: data.name,
      email: email.toString(),
      role: data.role,
    };

    const userToBeCreated = User.create(props, hashedPassword);

    const createdUser = await this.repository.create(userToBeCreated);

    if (!createdUser) {
      throw new AlreadyExistError("User already exists with given email");
    }

    const output: CreateUserOutputDTO = {
      id: createdUser.id.toString(),
      name: createdUser.name,
      email: createdUser.email.toString(),
      role: createdUser.role.toString(),
      isActive: createdUser.isActive,
      createdAt: createdUser.createdAt.toISOString(),
    };

    return output;
  }
}
