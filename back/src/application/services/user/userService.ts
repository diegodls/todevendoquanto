import {
  UserLoginInputDTO,
  UserLoginOutputDTO,
  UserLoginPayload,
} from "@/application/dtos/user/UserLoginDTO";
import { UserSignInInputDTO } from "@/application/dtos/user/UserSignInDTO";
import {
  UserUpdateInputDTO,
  UserUpdateOutputDTO,
} from "@/application/dtos/user/UserUpdateDTO";
import { IUserService } from "@/application/services/user/IUserService";
import { User } from "@/core/domain/User";
import { IJwtPayload } from "@/core/ports/infrastructure/auth/IJWTAuth";
import { IUserRepository } from "@/core/ports/repositories/IUserRepository";
import {
  AlreadyExistError,
  BadRequestError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/utils/errors/ApiError";
import { userServiceErrorCodes } from "@/core/shared/utils/errors/codes/user/userErrorCodes";

import bcrypt, { compare } from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

export class UserService implements IUserService {
  constructor(private readonly repository: IUserRepository) {}

  public async create(data: UserSignInInputDTO): Promise<User | null> {
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

  public async update(
    data: UserUpdateInputDTO,
    userJWT: IJwtPayload
  ): Promise<UserUpdateOutputDTO | null> {
    const userToUpdate: User | null = await this.repository.findByID(
      userJWT.sub
    );

    if (!userToUpdate) {
      throw new NotFoundError(
        "User to update not found with logged id",
        {},
        userServiceErrorCodes.E_0_SVC_USR_0003.code
      );
    }

    if (data?.email != userToUpdate.email) {
      throw new BadRequestError(
        "The logged email and the account email is different, logoff and try again",
        {},
        userServiceErrorCodes.E_0_SVC_USR_0004.code
      );
    }

    if (data?.name != userToUpdate.name) {
      throw new BadRequestError(
        "The logged name and the account name is different, logoff and try again",
        {},
        userServiceErrorCodes.E_0_SVC_USR_0004.code
      );
    }

    const updatedUser = await this.repository.

  }
}
