import {
  LoginUserInputDTO,
  LoginUserOutputDTO,
} from "@/core/usecases/auth/login-dto";

export interface LoginUseCaseInterface {
  execute(data: LoginUserInputDTO): Promise<LoginUserOutputDTO>;
}
