import { Password } from "@/core/entities/user/value-objects/password";
import { Email } from "@/core/entities/user/value-objects/user-email";
import { CompareInterface } from "@/core/ports/infrastructure/protocols/encryption/compare-interface";
import { JwtGenerateTokenInterface } from "@/core/ports/infrastructure/protocols/jwt/jwt-generate-token-interface";
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
    private readonly compare: CompareInterface,
    private readonly generateToken: JwtGenerateTokenInterface,
  ) {}

  public async execute(data: LoginUserInputDTO): Promise<LoginUserOutputDTO> {
    let userEmail: Email;
    let userPassword: Password;

    try {
      userEmail = Email.create(data.email);
      userPassword = Password.create(data.password);
    } catch (error) {
      throw new UnauthorizedError("Wrong credentials!");
    }

    const userExists = await this.repository.findByEmail(userEmail);

    if (!userExists) {
      throw new UnauthorizedError("Wrong credentials!");
    }

    if (!userExists.isActive) {
      throw new UnauthorizedError("User account is deactivated");
    }

    const isPasswordValid = await this.compare.execute(
      userPassword.getValue(),
      userExists.hashedPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Wrong credentials!");
    }

    const payload: LoginUserPayloadType = {
      email: userExists.email.toString(),
      role: userExists.role.toString(),
    };

    const token = this.generateToken.execute(payload, userExists.id.toString());

    return { token };
  }
}
