import { ErrorDTO } from "@/core/usecases/error/IErrorController";

export interface IErrorService {
  verify(data: ErrorDTO): ErrorDTO | null;
}
