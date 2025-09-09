import {
  ListUsersInputDTO,
  ListUsersOutputDTO,
} from "@/application/dtos/ListUsersDTO";
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
    request: AuthenticatedHttpRequest<ListUsersInputDTO>
  ): Promise<AuthenticatedHttpResponse<ListUsersOutputDTO>> {
    const adminUser = request.user;

    const body =
      bodyValidation<ListUsersInputDTO>(ListUsersBodySchema)(request);

    const usersList: User[] = await this.service.listUsers(adminUser.sub, body.page);

    PAREI AQUI, TEM QUE FAZER O SERVICE E DEMAIS COISAS

    const output: AuthenticatedHttpResponse<ListUsersOutputDTO> = {
      statusCode: 200,
      body: {
        page: 0,
        page_size: 0,
        total_items: 0,
        total_pages: 0,
        data: usersList,
      },
    };

    return output;
  }
}

export { ListUsersController };
