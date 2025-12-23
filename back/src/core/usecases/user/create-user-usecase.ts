import { User } from "@/core/entities/user";
import { EncryptInterface } from "@/core/ports/infrastructure/protocols/encryption/encrypt-interface";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import { AlreadyExistError } from "@/core/shared/errors/api-errors";
import { CreateUserInputDTO } from "@/core/usecases/user/create-user-dto";
import { CreateUserUseCaseInterface } from "@/core/usecases/user/create-user-usecase-interface";

export class CreateUserUseCase implements CreateUserUseCaseInterface {
  constructor(
    private readonly repository: UserRepositoryInterface,
    private readonly encrypt: EncryptInterface
  ) {}

  public async execute(data: CreateUserInputDTO): Promise<User | null> {
    const { name, email, password } = data;

    const userWithNameExists = await this.repository.findByName(name);

    if (userWithNameExists) {
      throw new AlreadyExistError("User already exists with given name");
    }

    const userWithEmailExists = await this.repository.findByEmail(email);

    if (userWithEmailExists) {
      throw new AlreadyExistError("User already exists with given email");
    }

    const encryptedPassword = await this.encrypt.execute(password);

    const userToBeCreated = new User({
      name,
      email,
      password: encryptedPassword,
    });

    return await this.repository.create(userToBeCreated);

    // TODO: maybe return full user from repository and return the user without password in here
    // verifying if exist, of course
  }
}
