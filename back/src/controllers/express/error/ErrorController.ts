import { ErrorService } from "../../../services/error/errorService";
import { HttpRequest, HttpResponse } from "../../../types/HttpRequestResponse";
import { InternalError } from "../../../utils/errors/ApiError";
import { testControllerErrorCodes } from "../../../utils/errors/codes/error/testErrorCodes";
import {
  ErrorDTO,
  IErrorController,
} from "../../interfaces/error/IErrorController";

class ErrorController implements IErrorController {
  constructor(private readonly service: ErrorService) {}

  handle(request: HttpRequest<ErrorDTO>): HttpResponse | void {
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

export { ErrorController };
