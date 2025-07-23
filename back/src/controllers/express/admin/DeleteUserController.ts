import { Request } from "express";
import jwt from "jsonwebtoken";
import {
  DeleteUserInputDTO,
  DeleteUserOutputDTO,
} from "../../../core/domain/User";
import { IUserLoginDecode } from "../../../core/ports/auth";
import { AdminService } from "../../../services/admin/adminService";
import { HttpRequest, HttpResponse } from "../../../types/HttpRequestResponse";
import {
  NotModifiedError,
  UnauthorizedError,
} from "../../../utils/errors/ApiError";
import { adminControllerErrorCodes } from "../../../utils/errors/codes/admin/adminErrorCodes";
import { bodyValidation } from "../../../validation/zod/BodyValidation";
import { DeleteUserByIDBodySchema } from "../../../validation/zod/schemas/admin/DeleteUserByIDBodySchema";
import { IDeleteUserController } from "../../../core/usecases/admin/IDeleteUserController";

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
