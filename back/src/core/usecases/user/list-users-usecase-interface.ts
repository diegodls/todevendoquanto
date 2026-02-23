import {
  ListUserOutputDTO,
  ListUsersInputDTO,
} from "@/core/usecases/user/list-user-dto";

export interface ListUsersUseCaseInterface {
  execute(data: ListUsersInputDTO): Promise<ListUserOutputDTO>;
}
