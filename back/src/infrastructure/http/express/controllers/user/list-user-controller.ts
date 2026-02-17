import { UserListControllerType } from "@/core/ports/infrastructure/http/controllers/user/list-user-controller-type";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import {
  ListUserOutputDTO,
  ListUsersInputDTO,
  ListUsersRequestPaginatedQuery,
} from "@/core/usecases/user/list-user-dto";
import { ListUsersUseCase } from "@/core/usecases/user/list-users-usecase";

import { ListUserPaginationSchema } from "@/infrastructure/validation/zod/schemas/user/list-user-schema";
import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";

export class ListUserController implements UserListControllerType {
  constructor(private readonly service: ListUsersUseCase) {}

  public async handle(
    request: AuthenticatedHttpRequestInterface<
      {},
      {},
      {},
      ListUsersRequestPaginatedQuery
    >,
  ): Promise<AuthenticatedHttpResponseInterface<ListUserOutputDTO>> {
    const user = request.user;

    const queryProps = requestValidation(
      "query",
      request,
      ListUserPaginationSchema,
    );

    const data: ListUsersInputDTO = {
      requestingUserId: user.sub,
      ...queryProps,
    };

    const usersList = await this.service.execute(data);

    const output: AuthenticatedHttpResponseInterface<ListUserOutputDTO> = {
      statusCode: 200,
      body: usersList,
    };

    return output;
  }
}
