import { UserListControllerType } from "@/core/ports/infrastructure/http/controllers/user/list-user-controller-type";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import {
  ListUserOutputDTO,
  ListUsersInputDTO,
  ListUsersPaginatedQueryParams,
} from "@/core/usecases/user/list-user-dto";
import { ListUsersUseCaseInterface } from "@/core/usecases/user/list-users-usecase-interface";
import { ListUserSchema } from "@/infrastructure/validation/zod/schemas/user/list-user-schema";

import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";

export class ListUserController implements UserListControllerType {
  constructor(private readonly usecase: ListUsersUseCaseInterface) {}

  public async handle(
    request: AuthenticatedHttpRequestInterface<
      {},
      {},
      {},
      ListUsersPaginatedQueryParams
    >,
  ): Promise<AuthenticatedHttpResponseInterface<ListUserOutputDTO>> {
    const queryProps = requestValidation("query", request, ListUserSchema);

    const data: ListUsersInputDTO = {
      requestingUserId: request.user.sub,
      ...queryProps,
    };

    const usersList = await this.usecase.execute(data);

    const output: AuthenticatedHttpResponseInterface<ListUserOutputDTO> = {
      statusCode: 200,
      body: usersList,
    };

    return output;
  }
}
