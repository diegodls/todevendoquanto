import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepositoryInterface } from "../../repositories/user/user.repository.interface";
import { CustomApiErrors } from "../../util/api.errors";
import { CreateUserAuth } from "../../util/validations/zod/admin/admin.create-user.zod.validation";
import { UserLoginBody } from "../../util/validations/zod/user/user.login.zod.validation";
import {
  UserLoginOutputDto,
  UserServiceInterface,
} from "./user.service.interface";

export type JWT_Payload = { id: string };

export class UserService implements UserServiceInterface {
  private constructor(readonly repository: UserRepositoryInterface) {}

  public static build(repository: UserRepositoryInterface) {
    return new UserService(repository);
  }

  public async generateUserLoginToken({
    email,
    password,
  }: UserLoginBody): Promise<UserLoginOutputDto> {
    const userExists = await this.repository.findByEmail(email);

    if (!userExists) {
      throw new CustomApiErrors.UnauthorizedError("Wrong credentials!");
    }

    const isValidPassword = await bcrypt.compare(password, userExists.password);

    if (!isValidPassword) {
      throw new CustomApiErrors.UnauthorizedError("Wrong credentials!");
    }

    const secret = process.env.JWT_PASS;

    if (!secret) {
      throw new CustomApiErrors.InternalError(
        "Internal Server Error, try later!"
      );
    }

    const tokenExpiresTime = "8h";

    const payload: CreateUserAuth = { id: userExists.id };

    const token = jwt.sign(payload, secret, { expiresIn: tokenExpiresTime });

    const output: UserLoginOutputDto = { token };

    return output;
  }
}
