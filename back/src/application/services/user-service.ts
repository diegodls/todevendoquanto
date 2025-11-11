import {
  UserLoginInputDTO,
  UserLoginOutputDTO,
  UserLoginPayload,
} from "@/application/dtos/user/user-login-dto";
import { UserSignInInputDTO } from "@/application/dtos/user/user-sign-in-dto";
import {
  UserUpdateInputDTO,
  UserUpdateOutputDTO,
} from "@/application/dtos/user/user-update-dto";
import { User } from "@/core/entities/user";
import { UserServiceInterface } from "@/core/ports/application/services/user-service-interface";
import { JwtPayloadInterface } from "@/core/ports/infrastructure/auth/jwt-auth-interface";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  AlreadyExistError,
  BadRequestError,
  InternalError,
  NotModifiedError,
  UnauthorizedError,
} from "@/core/shared/utils/errors/api-error";
import { userServiceErrorCodes } from "@/core/shared/utils/errors/codes/user/user-error-codes";

import bcrypt, { compare } from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

export class UserService implements UserServiceInterface {
  constructor(private readonly repository: UserRepositoryInterface) {}

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
    loggedUserJWT: JwtPayloadInterface,
    targetUserID: User["id"],
    data: UserUpdateInputDTO
  ): Promise<UserUpdateOutputDTO | null> {
    const loggedUser: User | null = await this.repository.findByID(
      loggedUserJWT.sub
    );

    if (!loggedUser) {
      throw new UnauthorizedError(
        "Invalid authentication: user not found!",
        {},
        userServiceErrorCodes.E_0_SVC_USR_0003.code
      );
    }

    const isLoggedUserAdmin: boolean = loggedUser.role === "ADMIN";

    if (!isLoggedUserAdmin) {
      delete data.role;
      delete data.is_active;
    }

    const targetUser: User | null = await this.repository.findByID(
      targetUserID
    );

    if (!targetUser) {
      throw new BadRequestError(
        "The user to be updated was not found with given ID!"
      );
    }

    this.ensureUserCanUpdate(loggedUser, targetUser);

    const sanitizedData = this.sanitizeData(loggedUser, targetUser, data);

    await this.validateUniqueFields(targetUser, sanitizedData);

    if (Object.keys(sanitizedData).length <= 0) {
      throw new NotModifiedError();
    }

    const updatedUser = await this.repository.update(
      targetUserID,
      sanitizedData
    );

    const output = updatedUser ? { ...updatedUser, password: "" } : null;

    return output;
  }

  private ensureUserCanUpdate(loggedUser: User, targetUser: User): void {
    const isAdmin = loggedUser.role === "ADMIN";

    if (!isAdmin && loggedUser.id !== targetUser.id) {
      throw new UnauthorizedError(
        "You don't have the permissions",
        {},
        userServiceErrorCodes.E_0_SVC_USR_0004.code
      );
    }
  }

  private sanitizeData(
    loggedUser: User,
    targetUser: User,
    data: UserUpdateInputDTO
  ): UserUpdateInputDTO {
    const sanitizedData: UserUpdateInputDTO = { ...data };

    const isAdmin = loggedUser.role === "ADMIN";

    if (!isAdmin) {
      delete sanitizedData.role;
      delete sanitizedData.is_active;
    }

    if (targetUser.email === sanitizedData?.email) {
      delete sanitizedData.email;
    }

    if (targetUser.name === sanitizedData?.name) {
      delete sanitizedData.name;
    }

    return sanitizedData;
  }

  private async validateUniqueFields(
    targetUser: User,
    data: UserUpdateInputDTO
  ): Promise<void> {
    if (data?.name && data.name !== targetUser.name) {
      const userToChangeExists = await this.repository.findByName(data.name);

      if (userToChangeExists) {
        throw new BadRequestError(
          "Name already in use",
          { name: "Name already in use" },
          userServiceErrorCodes.E_0_SVC_USR_0005.code
        );
      }
    }

    if (data?.email && data.email !== targetUser.email) {
      const userToChangeExists = await this.repository.findByEmail(data.email);

      if (userToChangeExists) {
        throw new BadRequestError(
          "Email already in use",
          { email: "Email already in use" },
          userServiceErrorCodes.E_0_SVC_USR_0005.code
        );
      }
    }
  }
}
