// import { IJWTAuth } from "@/core/ports/infrastructure/auth/IJWTAuth";
// import { AuthenticatedHttpRequest } from "@/core/shared/types/HttpRequestResponse";
// import { UnauthorizedError } from "@/core/shared/utils/errors/ApiError";
// import { adminControllerErrorCodes } from "@/core/shared/utils/errors/codes/admin/adminErrorCodes";
// import { NextFunction, Request, Response } from "express";

// const IsAdminMiddleware = (jwtAuth: IJWTAuth) => {
//   return async (request: Request, _response: Response, next: NextFunction) => {
//     const authHeader = request.headers.authorization;

//     if (!authHeader?.startsWith("Bearer ")) {
//       throw new UnauthorizedError(
//         "Not authorized",
//         {},
//         adminControllerErrorCodes.E_0_CTR_ADM_0001.code
//       );
//     }

//     const token = authHeader.split(" ")[1];

//     // TODO: verificar o expiration date

//     //const [bearer, token] = authHeader.split(" ");

//     const decoded = await jwtAuth.verifyToken(token);

//     if (decoded?.role !== "ADMIN") {
//       throw new UnauthorizedError(
//         "Not authorized",
//         {},
//         adminControllerErrorCodes.E_0_CTR_ADM_0001.code
//       );
//     }

//     (request as unknown as AuthenticatedHttpRequest).user = decoded;

//     console.log("");
//     console.log("⚠️⚠️⚠️⚠️⚠️");
//     console.log("decoded:");
//     console.log(decoded);

//     //request.user = decoded as AuthenticatedHttpRequest<Request>;

//     next();
//   };
// };

// export { IsAdminMiddleware };
