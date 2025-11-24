import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";
import { User } from "@/core/entities/user";
import { UserListControllerType } from "@/core/ports/infrastructure/http/controllers/authenticated/user/user-list-controller-type";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import { UserListRequestPaginatedQuery } from "@/core/usecases/user/list-user-dto";
import { ListUserUseCase } from "@/core/usecases/user/list-user-usecase";

import { FinalUserListPaginationSchema } from "@/infrastructure/validation/zod/schemas/admin/user-list-schema";
import { requestValidation } from "@/infrastructure/validation/zod/shared/validation/request-validation";

export class ListUserController implements UserListControllerType {
  constructor(private readonly service: ListUserUseCase) {}

  public async handle(
    request: AuthenticatedHttpRequestInterface<
      {},
      {},
      {},
      UserListRequestPaginatedQuery
    >
  ): Promise<AuthenticatedHttpResponseInterface<PaginatedResponse<User>>> {
    const adminUser = request.user;

    const input = requestValidation(
      "query",
      request,
      FinalUserListPaginationSchema
    );

    const usersList = await this.service.execute(input);

    const output: AuthenticatedHttpResponseInterface<PaginatedResponse<User>> =
      {
        statusCode: 200,
        body: usersList,
      };

    return output;
  }
}
