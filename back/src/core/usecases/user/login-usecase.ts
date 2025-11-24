import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  InternalError,
  UnauthorizedError,
} from "@/core/shared/errors/api-errors";
import { useCasesErrorsCodes } from "@/core/shared/errors/usecases/user-usecase-errors";
import {
  LoginUserInputDTO,
  LoginUserOutputDTO,
  LoginUserPayload,
} from "@/core/usecases/user/login-dto";
import { LoginUseCaseInterface } from "@/core/usecases/user/login-usecase-interface";
import { compare } from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

export class LoginUseCase implements LoginUseCaseInterface {
  constructor(private readonly repository: UserRepositoryInterface) {}

  public async execute(data: LoginUserInputDTO): Promise<LoginUserOutputDTO> {
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
        useCasesErrorsCodes.E_0_USC_USR_0001.code
      );
    }

    const tokenExpireTime: SignOptions["expiresIn"] = "8h";

    const payload: LoginUserPayload = {
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
