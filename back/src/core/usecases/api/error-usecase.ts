import { ErrorDTOInterface } from "@/core/ports/infrastructure/http/controllers/error/error-controller-interface";
import { InternalError } from "@/core/shared/utils/errors/api-error";
import { testServiceErrorCodes } from "@/core/shared/utils/errors/codes/error/test-error-codes";
import { ErrorServiceInterface } from "@/core/usecases/api/error-usecase-interface";

export class ErrorService implements ErrorServiceInterface {
  execute(data: ErrorDTOInterface): ErrorDTOInterface | null {
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
