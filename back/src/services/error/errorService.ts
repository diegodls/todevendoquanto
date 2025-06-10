import { ErrorDTO } from "../../controllers/interfaces/error/IErrorController";
import { InternalError } from "../../utils/errors/ApiError";
import { testServiceErrorCodes } from "../../utils/errors/codes/error/testErrorCodes";
import { IErrorService } from "./IErrorService";

class ErrorService implements IErrorService {
  verify(data: ErrorDTO): ErrorDTO | null {
    const { where } = data;
    console.log("service");

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

export { ErrorService };
