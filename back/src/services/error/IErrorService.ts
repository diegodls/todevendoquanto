import { ErrorDTO } from "../../core/usecases/error/IErrorController";

interface IErrorService {
  verify(data: ErrorDTO): ErrorDTO | null;
}

export { IErrorService };
