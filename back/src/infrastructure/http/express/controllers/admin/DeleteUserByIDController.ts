import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDOutputDTO,
} from "@/application/dtos/DeleteUserDTO";
import { AdminService } from "@/application/services/admin/adminService";
import {
  AuthenticatedHttpRequest,
  HttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import { NotModifiedError } from "@/core/shared/utils/errors/ApiError";
import { IDeleteUserByIDController } from "@/core/usecases/admin/IDeleteUserByIDController";
import { bodyValidation } from "@/infrastructure/validation/zod/BodyValidation";
import { DeleteUserByIDBodySchema } from "@/infrastructure/validation/zod/schemas/admin/DeleteUserByIDBodySchema";
class DeleteUserByIDController implements IDeleteUserByIDController {
  constructor(private readonly service: AdminService) {}
  public async handle(
    request: AuthenticatedHttpRequest<DeleteUserByIDInputDTO>
  ): Promise<HttpResponse<DeleteUserByIDOutputDTO>> {
    const adminUser = request.user;

    const body = bodyValidation<DeleteUserByIDInputDTO>(
      DeleteUserByIDBodySchema
    )(request);

    const deletedUser = await this.service.deleteUserById(
      adminUser.sub,
      body.id
    );

    if (!deletedUser) {
      throw new NotModifiedError("User to be deleted not found");
    }

    const output: HttpResponse<DeleteUserByIDOutputDTO> = {
      statusCode: 200,
      body: { deletedId: deletedUser.id },
    };

    return output;
  }
}

export { DeleteUserByIDController };
