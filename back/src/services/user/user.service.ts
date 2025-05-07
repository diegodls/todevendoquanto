import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepositoryInterface } from "../../repositories/user/user.repository.interface";
import { CustomApiErrors } from "../../util/api.errors";
import { UserLoginBody } from "../../util/validations/zod/user/user.login.zod.validation";
import {
  UserLoginOutputDto,
  UserServiceInterface,
} from "./user.service.interface";

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
    console.log("");
    console.log(email);
    console.log(password);
    console.log("");
    console.log(`ID: ${userExists.id}`);
    console.log(`EMAIL: ${userExists.email}`);
    console.log(`PASSWORD: ${userExists.password}`);
    console.log(`Role: ${userExists.role}`);
    console.log(`Permissions: ${userExists.permissions}`);
    console.log("");

    console.log(`VALID: ${isValidPassword}`);

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

    const payload = { id: userExists.id };

    const token = jwt.sign(payload, secret, { expiresIn: tokenExpiresTime });

    console.log("");
    console.log("TOKEN:");
    console.log(token);

    //$2b$10$NOi7A15uWP9nkDwfECwAduedW4bWbsBGH1Ady3j5WLsRmpCwyNP.u
    const output: UserLoginOutputDto = { token };

    return output;
  }
}
