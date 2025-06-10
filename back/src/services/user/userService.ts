import { CreateUserInputDTO, User } from "../../entities/User";
import { IUserRepository } from "../../repositories/IUserRepository";
import { AlreadyExistError } from "../../utils/errors/ApiError";
import { IUserService } from "./IUserService";

export class UserService implements IUserService {
  constructor(private readonly repository: IUserRepository) {}

  public async create(data: CreateUserInputDTO): Promise<User | null> {
    const { name, email, password } = data;

    console.log("");
    console.log("userService");
    console.log({ name, email, password });

    const userAlreadyExists = await this.repository.findByEmail(email);

    if (userAlreadyExists) {
      console.log("");
      console.log("🔴🔴🔴");
      console.log({ ...userAlreadyExists });
      throw new AlreadyExistError("User already exists with given email");
    }

    const userToBeCreated = new User({ name, email, password });

    return await this.repository.create(userToBeCreated);
  }
}
