import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "@/core/usecases/user/create-user-dto";

export interface CreateUserUseCaseInterface {
  execute(data: CreateUserInputDTO): Promise<CreateUserOutputDTO>;
}
