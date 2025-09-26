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
  NotModifiedError,
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
    userJWT: IJwtPayload,
    data: UserUpdateInputDTO
  ): Promise<UserUpdateOutputDTO | null> {
    let newData: UserUpdateInputDTO = {};

    let userExists: User | null = null;

    if (data?.email) {
      userExists = await this.repository.findByEmail(data.email);

      if (userExists) {
        throw new BadRequestError("The email is already in use");
      }
    }

    if (data?.name) {
      userExists = await this.repository.findByName(data.name);

      if (userExists) {
        throw new BadRequestError("The name is already in use");
      }
    }

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

    if (userJWT.email !== userToUpdate.email) {
      throw new BadRequestError(
        "Mismatch of data, email of accounts are different, login and try again",
        {},
        userServiceErrorCodes.E_0_SVC_USR_0004.code
      );
    }

    if (userJWT.sub !== userToUpdate.id) {
      throw new BadRequestError(
        "Mismatch of data, ID of accounts are different, login and try again",
        {},
        userServiceErrorCodes.E_0_SVC_USR_0004.code
      );
    }

    if (data?.email !== userToUpdate.email) {
      newData.email = data.email;
    }

    if (data?.name !== userToUpdate.name) {
      newData.name = data.name;
    }

    if (!newData || (!newData?.email && !newData.name)) {
      let errors: any = {};

      !data.email && (errors["email"] = "Email are the same");

      !data.name && (errors["name"] = "Name are the same");

      throw new NotModifiedError();
    }

    const updatedUser = await this.repository.update(userJWT, data);

    return updatedUser;
  }
}
