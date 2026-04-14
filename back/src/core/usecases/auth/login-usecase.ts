import { Password } from "@/core/entities/user/value-objects/password";
import { Email } from "@/core/entities/user/value-objects/user-email";

import { JwtGenerateTokenInterface } from "@/core/ports/infrastructure/protocols/jwt/jwt-generate-token-interface";
import { PasswordHasherInterface } from "@/core/ports/infrastructure/protocols/passwordHasher-interface";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import { UnauthorizedError } from "@/core/shared/errors/api-errors";
import {
  LoginUserInputDTO,
  LoginUserOutputDTO,
  LoginUserPayloadType,
} from "@/core/usecases/auth/login-dto";
import { LoginUseCaseInterface } from "@/core/usecases/auth/login-usecase-interface";

export class LoginUseCase implements LoginUseCaseInterface {
  constructor(
    private readonly repository: UserRepositoryInterface,
    private readonly passwordHasher: PasswordHasherInterface,
    private readonly generateToken: JwtGenerateTokenInterface,
  ) {}

  public async execute(data: LoginUserInputDTO): Promise<LoginUserOutputDTO> {
    const credentials = this.parseCredentials(data);

    if (!credentials) {
      throw new UnauthorizedError("Wrong credentials!");
    }

    const user = await this.repository.findByEmail(credentials.email);

    if (!user) {
      throw new UnauthorizedError("Wrong credentials!");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("User account is deactivated");
    }

    const isPasswordValid = await this.passwordHasher.compare(
      credentials.password.getValue(),
      user.hashedPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Wrong credentials!");
    }

    const payload: LoginUserPayloadType = {
      email: user.email.toString(),
      role: user.role.toString(),
    };

    const token = this.generateToken.execute(payload, user.id.toString());

    return { token };
  }

  private parseCredentials(
    data: LoginUserInputDTO,
  ): { email: Email; password: Password } | null {
    try {
      return {
        email: Email.create(data.email),
        password: Password.create(data.password),
      };
    } catch {
      return null;
    }
  }
}
