import { ErrorServiceInterface } from "@/core/ports/application/services/error-service-interface";
import { InternalError } from "@/core/shared/utils/errors/api-error";
import { testServiceErrorCodes } from "@/core/shared/utils/errors/codes/error/test-error-codes";
import { ErrorDTOInterface } from "@/core/usecases/error/error-controller-interface";

export class ErrorService implements ErrorServiceInterface {
  verify(data: ErrorDTOInterface): ErrorDTOInterface | null {
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
