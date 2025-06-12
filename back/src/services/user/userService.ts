import {
  CreateUserInputDTO,
  User,
  UserLoginInputDTO,
  UserLoginOutputDTO,
} from "../../entities/User";
import { IUserRepository } from "../../repositories/IUserRepository";
import {
  AlreadyExistError,
  UnauthorizedError,
} from "../../utils/errors/ApiError";
import { IUserService } from "./IUserService";

export class UserService implements IUserService {
  constructor(private readonly repository: IUserRepository) {}

  public async create(data: CreateUserInputDTO): Promise<User | null> {
    const { name, email, password } = data;

    const userAlreadyExists = await this.repository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AlreadyExistError("User already exists with given email");
    }

    const userToBeCreated = new User({ name, email, password });

    return await this.repository.create(userToBeCreated);
  }

  public async login(data: UserLoginInputDTO): Promise<UserLoginOutputDTO> {
    const { email, password } = data;

    const userAlreadyExists = await this.repository.findByEmail(email);

    if (!userAlreadyExists) {
      throw new UnauthorizedError("Wrong credentials!");
    }

    return { token: "" };
  }
}
