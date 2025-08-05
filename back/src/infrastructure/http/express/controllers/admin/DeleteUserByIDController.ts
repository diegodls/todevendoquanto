import {
  DeleteUserByIDInputDTO,
  DeleteUserByIDOutputDTO,
} from "@/application/dtos/DeleteUserDTO";
import { AdminService } from "@/application/services/admin/adminService";
import { IUserLoginDecode } from "@/core/ports/infrastructure/auth/IJWTAuth";
import {
  HttpRequest,
  HttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import {
  NotModifiedError,
  UnauthorizedError,
} from "@/core/shared/utils/errors/ApiError";
import { adminControllerErrorCodes } from "@/core/shared/utils/errors/codes/admin/adminErrorCodes";
import { IDeleteUserByIDController } from "@/core/usecases/admin/IDeleteUserByIDController";
import { bodyValidation } from "@/infrastructure/validation/zod/BodyValidation";
import { DeleteUserByIDBodySchema } from "@/infrastructure/validation/zod/schemas/admin/DeleteUserByIDBodySchema";

import jwt from "jsonwebtoken";

class DeleteUserByIDController implements IDeleteUserByIDController {
  constructor(private readonly service: AdminService) {}
  public async handle(
    request: HttpRequest<DeleteUserByIDInputDTO>
  ): Promise<HttpResponse<DeleteUserByIDOutputDTO>> {
    const authHeader = request.headers.authorization;

    const body = bodyValidation<DeleteUserByIDInputDTO>(
      DeleteUserByIDBodySchema
    )(request);

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Not authorized",
        {},
        adminControllerErrorCodes.E_0_CTR_ADM_0001.code
      );
    }

    const token = authHeader.split(" ")[1];

    const jwtSecret = process.env.JWT_PASS ?? "";

    const decode = jwt.verify(token, jwtSecret) as IUserLoginDecode;

    if (decode?.role !== "ADMIN") {
      throw new UnauthorizedError(
        "Not authorized",
        {},
        adminControllerErrorCodes.E_0_CTR_ADM_0001.code
      );
    }

    const deletedUser = await this.service.deleteUserById(decode.sub, body.id);

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
