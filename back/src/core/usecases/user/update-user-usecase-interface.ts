import {
  UpdateUserInputDTO,
  UpdateUserOutputDTO,
} from "@/core/usecases/user/update-user-dto";

export interface UpdateUserUseCaseInterface {
  execute(data: UpdateUserInputDTO): Promise<UpdateUserOutputDTO | null>;
}
