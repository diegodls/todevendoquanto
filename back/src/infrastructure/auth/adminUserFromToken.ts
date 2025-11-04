import { IJwtPayload } from "@/core/ports/infrastructure/auth/IJWTAuth";
import { PublicHttpRequest } from "@/core/shared/types/HttpRequestResponse";
import { UnauthorizedError } from "@/core/shared/utils/errors/ApiError";
import { adminControllerErrorCodes } from "@/core/shared/utils/errors/codes/admin/adminErrorCodes";
import { JWTAuth } from "@/infrastructure/auth/JWTAuth";

const jwtHandler = new JWTAuth();

export const adminUserFromToken = async (request: PublicHttpRequest) => {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError(
      "Not authorized",
      {},
      adminControllerErrorCodes.E_0_CTR_ADM_0001.code
    );
  }

  const token = authHeader.split(" ")[1];

  // TODO: verificar o expiration date

  const user = await jwtHandler.verifyToken<IJwtPayload>(token);

  if (user?.role !== "ADMIN") {
    throw new UnauthorizedError(
      "Not authorized",
      {},
      adminControllerErrorCodes.E_0_CTR_ADM_0001.code
    );
  }

  return user;
};
