import { CompareInterface } from "@/core/ports/infrastructure/encryption/compare-interface";
import { JwtGenerateTokenInterface } from "@/core/ports/infrastructure/jwt/jwt-generate-token-interface";
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
    private readonly generateToken: JwtGenerateTokenInterface
  ) {}

  public async execute(data: LoginUserInputDTO): Promise<LoginUserOutputDTO> {
    const { email, password } = data;

    const userExists = await this.repository.findByEmail(email);

    if (!userExists) {
      throw new UnauthorizedError("Wrong credentials!");
    }

    const isPasswordValid = await this.compare.execute(
      password,
      userExists.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Wrong credentials!");
    }

    const payload: LoginUserPayloadType = {
      email: userExists.email,
      role: userExists.role,
    };

    const token = this.generateToken.execute(payload, userExists.id);

    return { token };
  }
}
