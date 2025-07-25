import {
  DeleteUserInputDTO,
  DeleteUserOutputDTO,
} from "@/application/dtos/DeleteUserDTO";
import { AdminService } from '@/application/services/admin/adminService';
import { IUserLoginDecode } from "@/core/ports/infrastructure/middlewares/JWTAuth";
import {
  HttpRequest,
  HttpResponse,
} from "@/core/shared/types/HttpRequestResponse";
import {
  NotModifiedError,
  UnauthorizedError,
} from "@/core/shared/utils/errors/ApiError";
import { adminControllerErrorCodes } from "@/core/shared/utils/errors/codes/admin/adminErrorCodes";
import { IDeleteUserController } from "@/core/usecases/admin/IDeleteUserController";
import { bodyValidation } from "@/infrastructure/validation/zod/BodyValidation";
import { DeleteUserByIDBodySchema } from "@/infrastructure/validation/zod/schemas/admin/DeleteUserByIDBodySchema";

import { Request } from "express";
import jwt from "jsonwebtoken";

class DeleteUserController implements IDeleteUserController {
  constructor(private readonly service: AdminService) {}
  public async handle(
    request: HttpRequest<DeleteUserInputDTO, Request["headers"]>
  ): Promise<HttpResponse<DeleteUserOutputDTO>> {
    const authHeader = request.headers.authorization;

    const data = bodyValidation<DeleteUserInputDTO>(DeleteUserByIDBodySchema)(
      request
    );

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

    const deletedUser = await this.service.deleteUserById(decode.sub, data.id);

    if (!deletedUser) {
      throw new NotModifiedError("User to be deleted not found");
    }

    const output: HttpResponse<DeleteUserOutputDTO> = {
      statusCode: 200,
      body: { deletedId: deletedUser.id },
    };

    return output;
  }
}

export { DeleteUserController };
