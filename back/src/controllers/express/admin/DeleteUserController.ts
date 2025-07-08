import { Request } from "express";
import jwt from "jsonwebtoken";
import {
  DeleteUserInputDTO,
  DeleteUserOutputDTO,
  UserLoginPayload,
} from "../../../entities/User";
import { AdminService } from "../../../services/admin/adminService";
import { HttpRequest, HttpResponse } from "../../../types/HttpRequestResponse";
import { UnauthorizedError } from "../../../utils/errors/ApiError";
import { adminControllerErrorCodes } from "../../../utils/errors/codes/admin/adminErrorCodes";
import { bodyValidation } from "../../../validation/zod/BodyValidation";
import { DeleteUserByIDBodySchema } from "../../../validation/zod/schemas/admin/DeleteUserByIDBodySchema";
import { IDeleteUserController } from "../../interfaces/admin/IDeleteUserController";

class DeleteUserController implements IDeleteUserController {
  constructor(private readonly service: AdminService) {}
  handle(
    request: HttpRequest<DeleteUserInputDTO, Request["headers"]>
  ): HttpResponse<DeleteUserOutputDTO> {
    const authHeader = request.headers.authorization;

    const data = bodyValidation<DeleteUserInputDTO>(DeleteUserByIDBodySchema)(
      request
    );

    console.log("body data");
    console.log(data);

    console.log("authHeader");
    console.log(authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Not authorized",
        {},
        adminControllerErrorCodes.E_0_CTR_ADM_0001.code
      );
    }

    const token = authHeader.split(" ")[1];

    const jwtSecret = process.env.JWT_PASS ?? "";

    const decode = jwt.verify(token, jwtSecret) as UserLoginPayload;

    if (decode.role !== "ADMIN") {
      throw new UnauthorizedError(
        "Not authorized",
        {},
        adminControllerErrorCodes.E_0_CTR_ADM_0001.code
      );
    }

    const output: HttpResponse<DeleteUserOutputDTO> = {
      statusCode: 200,
      body: { deletedId: decode.email },
    };

    return output;
  }
}

export { DeleteUserController };
