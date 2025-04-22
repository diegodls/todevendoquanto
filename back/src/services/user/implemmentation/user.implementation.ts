import { UserRepository } from "../../../repositories/user/user.repository";
import { CreateOutputDto, UserService } from "../user.service";

export class UserServiceImplementation implements UserService {
  private constructor(readonly repository: UserRepository) {}

  public static build(repository: UserRepository) {
    return new UserServiceImplementation(repository);
  }

  public async create(
    name: string,
    email: string,
    password: string
  ): Promise<CreateOutputDto> {
    const userExists = this.repository.findByEmail(email);
  }
}
