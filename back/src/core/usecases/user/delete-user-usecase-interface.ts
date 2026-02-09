import { UserId } from "@/core/entities/user/value-objects/user-id";
import { DeleteUserByIDOutputDTO } from "@/core/usecases/user/delete-user-dto";

export interface DeleteUserUseCaseInterface {
  execute(id: UserId): Promise<DeleteUserByIDOutputDTO>;
}
