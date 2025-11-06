import { JwtPayloadInterface } from "@/core/ports/infrastructure/auth/jwt-auth-interface";
import { PublicHttpRequestInterface } from "@/core/shared/types/http-request-response";
import { UnauthorizedError } from "@/core/shared/utils/errors/api-error";
import { adminControllerErrorCodes } from "@/core/shared/utils/errors/codes/admin/admin-error-codes";
import { JWTAuth } from "@/infrastructure/auth/jwt-auth";

const jwtHandler = new JWTAuth();

export const adminUserFromToken = async (
  request: PublicHttpRequestInterface
) => {
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

  const user = await jwtHandler.verifyToken<JwtPayloadInterface>(token);

  if (user?.role !== "ADMIN") {
    throw new UnauthorizedError(
      "Not authorized",
      {},
      adminControllerErrorCodes.E_0_CTR_ADM_0001.code
    );
  }

  return user;
};
