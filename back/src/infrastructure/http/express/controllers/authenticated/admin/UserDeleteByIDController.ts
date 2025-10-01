import {
  UserDeleteByIDInputDTO,
  UserDeleteByIDOutputDTO,
} from "@/application/dtos/user/UserDeleteDTO";
import { AdminService } from "@/application/services/admin/adminService";
import {
  AuthenticatedHttpRequest,
  AuthenticatedHttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { BadRequestError } from "@/core/shared/utils/errors/ApiError";
import { IUserDeleteByIDController } from "@/core/usecases/authenticated/user/IUserDeleteByIDController";

import { requestValidation } from "@/infrastructure/validation/zod/RequestValidation";

import { UserDeleteByIDBodySchema } from "@/infrastructure/validation/zod/schemas/admin/UserDeleteByIDBodySchema";

class UserDeleteByIDController implements IUserDeleteByIDController {
  constructor(private readonly service: AdminService) {}
  public async handle(
    request: AuthenticatedHttpRequest<UserDeleteByIDInputDTO>
  ): Promise<AuthenticatedHttpResponse<UserDeleteByIDOutputDTO>> {
    const adminUser = request.user;

    const body = requestValidation<UserDeleteByIDInputDTO>(
      UserDeleteByIDBodySchema
    )(request, "body");

    const deletedUser = await this.service.deleteUserById(
      adminUser.sub,
      body.id
    );

    if (!deletedUser) {
      throw new BadRequestError("User to be deleted not found");
    }

    const output: AuthenticatedHttpResponse<UserDeleteByIDOutputDTO> = {
      statusCode: 200,
      body: { deletedId: deletedUser.id },
    };

    return output;
  }
}

export { UserDeleteByIDController };
