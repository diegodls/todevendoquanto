import bcrypt, { compare } from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

import {
  CreateUserInputDTO,
  User,
  UserLoginInputDTO,
  UserLoginOutputDTO,
  UserLoginPayload,
} from "../../entities/User";
import { IUserRepository } from "../../repositories/IUserRepository";
import {
  AlreadyExistError,
  InternalError,
  UnauthorizedError,
} from "../../utils/errors/ApiError";
import { userServiceErrorCodes } from "../../utils/errors/codes/user/userErrorCodes";
import { IUserService } from "./IUserService";

export class UserService implements IUserService {
  constructor(private readonly repository: IUserRepository) {}

  public async create(data: CreateUserInputDTO): Promise<User | null> {
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

  public async login(data: UserLoginInputDTO): Promise<UserLoginOutputDTO> {
    const { email, password } = data;

    const userExists = await this.repository.findByEmail(email);

    if (!userExists) {
      throw new UnauthorizedError("Wrong credentials!");
    }

    const isPasswordValid = await compare(password, userExists.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Wrong credentials!");
    }

    const secret = process.env.JWT_PASS;

    if (!secret) {
      throw new InternalError(
        "Internal Server Error, try again latter",
        {},
        userServiceErrorCodes.E_0_SVC_USR_0001.code
      );
    }

    const tokenExpireTime: SignOptions["expiresIn"] = "8h";

    const payload: UserLoginPayload = {
      email: userExists.email,
      role: userExists.role,
    };

    const token = jwt.sign(payload, secret, {
      subject: userExists.id,
      expiresIn: tokenExpireTime,
    });

    return { token };
  }
}
