import { Request } from "express";
import { DeleteUserInputDTO, DeleteUserOutputDTO } from "../../entities/User";
import { AdminService } from "../../services/admin/adminService";
import { HttpRequest, HttpResponse } from "../../types/HttpRequestResponse";
import { UnauthorizedError } from "../../utils/errors/ApiError";
import { adminControllerErrorCodes } from "../../utils/errors/codes/admin/adminErrorCodes";
import { IDeleteUserController } from "../interfaces/admin/IDeleteUserController";

class DeleteUserController implements IDeleteUserController {
  constructor(private readonly service: AdminService) {}
  handle(
    request: HttpRequest<DeleteUserInputDTO, Request["headers"]>
  ): HttpResponse<DeleteUserOutputDTO> {
    const authHeader = request.headers.authorization;

    console.log(authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Not authorized",
        {},
        adminControllerErrorCodes.E_0_CTR_ADM_0001.code
      );
    }

    const id = authHeader.split(" ")[1];

    const output: HttpResponse<DeleteUserOutputDTO> = {
      statusCode: 200,
      body: { deletedId: id },
    };

    return output;
  }
}

export { DeleteUserController };
