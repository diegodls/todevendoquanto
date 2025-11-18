import { UserListRequestPaginatedQuery } from "@/application/dtos/admin/list-dto";
import { PaginatedResponse } from "@/application/dtos/shared/pagination-dto";
import { User } from "@/core/entities/user";
import { UserListControllerType } from "@/core/ports/infrastructure/http/controllers/authenticated/user/user-list-controller-type";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import { AdminService } from "@/core/usecases/admin-service";
import { FinalUserListPaginationSchema } from "@/infrastructure/validation/zod/schemas/admin/user-list-schema";
import { requestValidation } from "@/infrastructure/validation/zod/shared/validation/request-validation";

export class UserListController implements UserListControllerType {
  constructor(private readonly service: AdminService) {}

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

    const usersList = await this.service.listUsers(adminUser.sub, input);

    const output: AuthenticatedHttpResponseInterface<PaginatedResponse<User>> =
      {
        statusCode: 200,
        body: usersList,
      };

    return output;
  }
}
