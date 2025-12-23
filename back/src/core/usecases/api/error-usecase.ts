import {
  ApiErrorInputDTO,
  ApiErrorOutputDTO,
} from "@/core/ports/infrastructure/http/controllers/api/error-controller-interface";
import { InternalError } from "@/core/shared/errors/api-errors";
import { ErrorServiceInterface } from "@/core/usecases/api/error-usecase-interface";
import { testServiceErrorCodes } from "@/infrastructure/errors/codes/controllers/api/test-error-codes";

export class ErrorUseCase implements ErrorServiceInterface {
  execute(data: ApiErrorInputDTO): ApiErrorOutputDTO {
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
