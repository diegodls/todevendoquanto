import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDOutputDTO,
} from "@/core/usecases/user/delete-user-dto";

export interface DeleteUserUseCaseInterface {
  execute(data: DeleteUserByIDInputDTO): Promise<DeleteUserByIDOutputDTO>;
}
