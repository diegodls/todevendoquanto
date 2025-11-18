import {
  LoginUserInputDTO,
  LoginUserOutputDTO,
} from "@/core/usecases/user/login-dto";

export interface LoginUseCaseInterface {
  execute(data: LoginUserInputDTO): Promise<LoginUserOutputDTO>;
}
