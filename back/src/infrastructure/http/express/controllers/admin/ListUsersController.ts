import {
  ListUsersControllerFilters,
  PaginationInputDTO,
  PaginationOutputDTO,
} from "@/application/dtos/PaginationDTO";
import { AdminService } from "@/application/services/admin/adminService";
import { User } from "@/core/domain/User";
import {
  AuthenticatedHttpRequest,
  AuthenticatedHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { IListUsersController } from "@/core/usecases/admin/user/IListUsersController";
import { bodyValidation } from "@/infrastructure/validation/zod/BodyValidation";
import { ListUsersBodySchema } from "@/infrastructure/validation/zod/schemas/admin/ListUsersBodySchema";

class ListUsersController implements IListUsersController {
  constructor(private readonly service: AdminService) {}

  public async handle(
    request: AuthenticatedHttpRequest<
      PaginationInputDTO<User, ListUsersControllerFilters>
    >
  ): Promise<AuthenticatedHttpResponse<PaginationOutputDTO<User>>> {
    const input =
      bodyValidation<PaginationInputDTO<User, ListUsersControllerFilters>>(
        ListUsersBodySchema
      )(request);

    const usersList = await this.service.listUsers(input);

    const output: AuthenticatedHttpResponse<PaginationOutputDTO<User>> = {
      statusCode: 200,
      body: usersList,
    };

    return output;
  }
}

export { ListUsersController };
