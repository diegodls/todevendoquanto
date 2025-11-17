import {
  LoginUserInputDTO,
  LoginUserOutputDTO,
} from "@/application/dtos/user/login-dto";

export interface LoginUseCaseInterface {
  execute(data: LoginUserInputDTO): Promise<LoginUserOutputDTO>;
}
