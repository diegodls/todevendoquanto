import { CreateUserProps, User } from "@/core/entities/user/user";
import { Password } from "@/core/entities/user/value-objects/password";
import { Email } from "@/core/entities/user/value-objects/user-email";
import { PasswordHasherInterface } from "@/core/ports/infrastructure/protocols/passwordHasher-interface";
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
    private readonly passwordHasher: PasswordHasherInterface,
  ) {}

  public async execute(data: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    const email = Email.create(data.email);
    const password = Password.create(data.password);

    const userWithEmailExists = await this.repository.exists(email);

    if (userWithEmailExists) {
      throw new AlreadyExistError("User already exists with given email");
    }

    const hashedPassword = await this.passwordHasher.hash(password.getValue());

    const props: CreateUserProps = {
      name: data.name,
      email: data.email,
      role: data.role,
    };

    const userToBeCreated: User = User.create(props, hashedPassword);

    await this.repository.save(userToBeCreated);

    if (!userToBeCreated) {
      throw new AlreadyExistError("User already exists with given email");
    }

    const output: CreateUserOutputDTO = {
      id: userToBeCreated.id.toString(),
      name: userToBeCreated.name,
      email: userToBeCreated.email.toString(),
      role: userToBeCreated.role.toString(),
      isActive: userToBeCreated.isActive,
      createdAt: userToBeCreated.createdAt.toISOString(),
    };

    return output;
  }
}
