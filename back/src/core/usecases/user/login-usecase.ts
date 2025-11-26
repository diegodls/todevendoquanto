import { JwtGenerateTokenInterface } from "@/core/ports/infrastructure/auth/jwt-generate-token-interface";
import { CompareInterface } from "@/core/ports/infrastructure/encryption/compare-interface";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import { UnauthorizedError } from "@/core/shared/errors/api-errors";
import {
  LoginUserInputDTO,
  LoginUserOutputDTO,
  LoginUserPayload,
} from "@/core/usecases/user/login-dto";
import { LoginUseCaseInterface } from "@/core/usecases/user/login-usecase-interface";

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

    const payload: LoginUserPayload = {
      email: userExists.email,
      role: userExists.role,
    };

    const token = this.generateToken.execute(payload, userExists.id);

    return { token };
  }
}
