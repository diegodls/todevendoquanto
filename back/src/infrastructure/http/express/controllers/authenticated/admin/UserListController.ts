import { UserListRequestPaginatedQuery } from "@/application/dtos/admin/UserListDTO";
import { PaginatedResponse } from "@/application/dtos/shared/PaginationDTO";
import { AdminService } from "@/application/services/admin/adminService";
import { User } from "@/core/domain/User";
import {
  AuthenticatedHttpRequest,
  AuthenticatedHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { IUserListController } from "@/core/usecases/authenticated/user/IUserListController";
import { UserListQuerySchema } from "@/infrastructure/validation/zod/schemas/admin/UserListPaginationSchema";
import { PaginationSchema } from "@/infrastructure/validation/zod/shared/schemas/PaginationSchema";
import { requestValidation } from "@/infrastructure/validation/zod/shared/validation/RequestValidation";
import { PropsToString } from '@/core/shared/types/helpers/PropsToString';

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

    const inputList = requestValidation("query", request, UserListQuerySchema);

    const input = requestValidation("query", request, PaginationSchema);

    PAREI AQUI, TEM QUE TESTAR AS MUDANÇAS NO "requestValidation", SE ESTÁ RETORNANDO AS PROPS CONVERTIDAS ("string > number")
    E REFAZER AS PropsToString
    E TESTAR O MERGE DOS SCHEMAS
    E SE É UAM BOA DEIXAR O "requestValidation" DO JEITO QUE ESTÁ

    
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
