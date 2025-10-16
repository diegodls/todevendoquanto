import {
  UserListRequestFiltersProps,
  UserListRequestPaginatedQuery,
} from "@/application/dtos/admin/UserListDTO";
import { PaginatedResponse } from "@/application/dtos/shared/PaginationDTO";
import { AdminService } from "@/application/services/admin/adminService";
import { User } from "@/core/domain/User";
import {
  AuthenticatedHttpRequest,
  AuthenticatedHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { IUserListController } from "@/core/usecases/authenticated/user/IUserListController";
import { UserListPaginationSchema } from "@/infrastructure/validation/zod/schemas/admin/UserListPaginationSchema";
import { requestValidation } from "@/infrastructure/validation/zod/shared/validation/RequestValidation";

class UserListController implements IUserListController {
  constructor(private readonly service: AdminService) {}

  public async handle(
    request: AuthenticatedHttpRequest<{}, {}, {}, UserListRequestPaginatedQuery>
  ): Promise<AuthenticatedHttpResponse<PaginatedResponse<User>>> {
    const adminUser = request.user;

    console.log("");
    console.log("🔵🔵🔵🔵");
    console.log("");
    console.log("****request****");
    console.log(request.query);
    console.log("");
    console.log(`page?: ${request.query?.page}`);
    console.log("");

    const test: UserListRequestPaginatedQuery = { page: "2", name: "A" };

    const test2: UserListRequestFiltersProps = { page: 2, name: "A" };

    const inputRaw = UserListPaginationSchema.parse(request.query);

    console.log(
      `inputRaw: => name: ${inputRaw?.name} / page: ${inputRaw?.page}`
    );

    const input = requestValidation<UserListRequestFiltersProps>(
      "query",
      request,
      UserListPaginationSchema
    );

    console.log("");
    console.log("🔴🔴🔴🔴");
    console.log("");
    console.log("****ZOD-INPUT****");
    for (const key in input) {
      console.log(
        `${key}: ${JSON.stringify(input[key as keyof typeof input])}`
      );
    }
    console.log("");
    console.log("");

    const usersList = await this.service.listUsers(adminUser.sub, input);

    const output: AuthenticatedHttpResponse<PaginatedResponse<User>> = {
      statusCode: 200,
      body: usersList,
    };

    return output;
  }
}

export { UserListController };
