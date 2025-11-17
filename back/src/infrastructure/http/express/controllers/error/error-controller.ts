import {
  PublicHttpRequestInterface,
  PublicHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import { ErrorService } from "@/core/usecases/api/error-usecase";

import {
  ErrorControllerInterface,
  ErrorDTOInterface,
} from "@/core/ports/infrastructure/http/controllers/error/error-controller-interface";
import { InternalError } from "@/core/shared/utils/errors/api-error";
import { testControllerErrorCodes } from "@/core/shared/utils/errors/codes/error/test-error-codes";

export class ErrorController implements ErrorControllerInterface {
  constructor(private readonly service: ErrorService) {}

  handle(
    request: PublicHttpRequestInterface<ErrorDTOInterface>
  ): PublicHttpResponseInterface | void {
    const { where } = request.body;

    if (!where) {
      let message = "Error on Controller, props wasn't send";
      let errors = {
        controller: `Error on Controller, just for testing WHERE: ${where}`,
      };

      let code = testControllerErrorCodes.E_0_CTR_ERR_0001.code;
      throw new InternalError(message, errors, code);
    }

    if (where === "controller") {
      let message = "Error on Controller, props send is controller ";
      let errors = {
        controller: `Error on Controller, just for testing. WHERE: ${where}`,
      };

      let code = testControllerErrorCodes.E_0_CTR_ERR_0001.code;
      throw new InternalError(message, errors, code);
    }

    const data = this.service.verify({ where });

    return { body: { data }, statusCode: 200 };
  }
}
