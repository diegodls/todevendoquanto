import { PaginationOutputDTO } from "@/application/dtos/shared/PaginationDTO";
import { AdminService } from "@/application/services/admin/adminService";
import { User } from "@/core/domain/User";
import {
  AuthenticatedHttpRequest,
  AuthenticatedHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import {
  IUserListController,
  ListUsersControllerPaginationInput,
} from "@/core/usecases/authenticated/user/IUserListController";
import { requestValidation } from "@/infrastructure/validation/zod/RequestValidation";
import { UserListQuerySchema } from "@/infrastructure/validation/zod/schemas/admin/UserListQuerySchema";

class UserListController implements IUserListController {
  constructor(private readonly service: AdminService) {}

  public async handle(
    request: AuthenticatedHttpRequest<ListUsersControllerPaginationInput>
  ): Promise<AuthenticatedHttpResponse<PaginationOutputDTO<User>>> {
    const adminUser = request.user;

    console.log("");
    console.log("🔵🔵🔵🔵");
    console.log("");
    console.log("****request****");
    console.log(request.query);

    const input = requestValidation<ListUsersControllerPaginationInput>(
      "query",
      request,
      UserListQuerySchema
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

    const output: AuthenticatedHttpResponse<PaginationOutputDTO<User>> = {
      statusCode: 200,
      body: usersList,
    };

    return output;
  }
}

export { UserListController };
