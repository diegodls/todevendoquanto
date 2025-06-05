import { CreateUserDTO, User } from "../entities/User";
import { IUserRepository } from "../repositories/IUserRepository";

export class UserService {
  constructor(private readonly repository: IUserRepository) {}

  public async create(data: CreateUserDTO): Promise<User | null> {
    const { name, email, password } = data;

    const userAlreadyExists = await this.repository.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error("User already exists with given email");
    }

    const userToBeCreated = new User({ name, email, password });

    return await this.repository.create(userToBeCreated);
  }
}
