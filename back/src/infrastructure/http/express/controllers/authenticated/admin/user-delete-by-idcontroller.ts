import {
  UserDeleteByIDInputDTO,
  UserDeleteByIDOutputDTO,
} from "@/application/dtos/user/user-delete-dto";
import { AdminService } from "@/application/services/admin-service";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

import { BadRequestError } from "@/core/shared/utils/errors/api-error";
import { UserDeleteByIDControllerType } from "@/core/usecases/authenticated/user/user-delete-by-id-controller-type";
import { UserDeleteByIDParamsSchema } from "@/infrastructure/validation/zod/schemas/admin/user-delete-by-id-params-schema";
import { requestValidation } from "@/infrastructure/validation/zod/shared/validation/request-validation";

export class UserDeleteByIDController implements UserDeleteByIDControllerType {
  constructor(private readonly service: AdminService) {}
  public async handle(
    request: AuthenticatedHttpRequestInterface<UserDeleteByIDInputDTO>
  ): Promise<AuthenticatedHttpResponseInterface<UserDeleteByIDOutputDTO>> {
    const adminUser = request.user;

    const input = requestValidation(
      "params",
      request,
      UserDeleteByIDParamsSchema
    );

    /*
    PAREI AQUI, A TODA DE DELETAR USUÁRIO ESTÁ COM ERRO, MAS PRECISAMENTE NA VALIDAÇÃO DO JWT
    VERIFICAR O QUE ESTÁ CHEGANDO NO JWT DA REQUISIÇÃO
    E TAMBÉM PERGUNTAR PARA AS IAs SE VALE A PENA DEFINIR TUDO EM UM SERVICE/REPOSITORY
    REPOSITORY NO AdminService com list/update/blablabla OU SE SEPARA CADA SERVICE/REPOSITORY
    PARA UMA ROTA
*/

    const deletedUser = await this.service.deleteUserById(
      adminUser.sub,
      input.id
    );

    if (!deletedUser) {
      throw new BadRequestError("User to be deleted not found");
    }

    const output: AuthenticatedHttpResponseInterface<UserDeleteByIDOutputDTO> =
      {
        statusCode: 200,
        body: { deletedId: deletedUser.id },
      };

    return output;
  }
}
