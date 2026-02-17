import {
  ListUserOutputDTO,
  ListUsersRequestQueryProps,
} from "@/core/usecases/user/list-user-dto";

export interface ListUsersUseCaseInterface {
  execute(data: ListUsersRequestQueryProps): Promise<ListUserOutputDTO>;
}
