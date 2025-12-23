import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";

import {
  ApiErrorInputDTO,
  ApiErrorOutputDTO,
  ErrorControllerInterface,
} from "@/core/ports/infrastructure/http/controllers/api/error-controller-interface";
import { InternalError } from "@/core/shared/errors/api-errors";
import { ErrorUseCase } from "@/core/usecases/api/error-usecase";
import { testControllerErrorCodes } from "@/infrastructure/errors/codes/controllers/api/test-error-codes";

export class ErrorController implements ErrorControllerInterface {
  constructor(private readonly usecase: ErrorUseCase) {}

  async handle(
    request: AuthenticatedHttpRequestInterface<ApiErrorInputDTO>
  ): Promise<AuthenticatedHttpResponseInterface<ApiErrorOutputDTO>> {
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

    const data = this.usecase.execute({ where });

    const output: AuthenticatedHttpResponseInterface<ApiErrorOutputDTO> = {
      statusCode: 200,
      body: data,
    };

    return output;
  }
}
