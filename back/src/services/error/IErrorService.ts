import { ErrorDTO } from "../../controllers/interfaces/error/IErrorController";

interface IErrorService {
  verify(data: ErrorDTO): ErrorDTO | null;
}

export { IErrorService };
