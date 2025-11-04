import { InternalError } from "@/core/shared/utils/errors/ApiError";
import { testServiceErrorCodes } from "@/core/shared/utils/errors/codes/error/testErrorCodes";
import { ErrorDTO } from "@/core/usecases/error/IErrorController";
import { IErrorService } from "./IErrorService";

export class ErrorService implements IErrorService {
  verify(data: ErrorDTO): ErrorDTO | null {
    const { where } = data;

    if (where === "service") {
      let message = "Error on Service, just for testing";
      let errors = {
        controller: `Error on Service, just for testing WHERE: ${where}`,
      };
      let code = testServiceErrorCodes.E_0_SVC_ERR_0001.code;
      throw new InternalError(message, errors, code);
    }

    return data;
  }
}
