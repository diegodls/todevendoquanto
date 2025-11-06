import { ErrorDTOInterface } from "@/core/usecases/error/error-controller-interface";

export interface ErrorServiceInterface {
  verify(data: ErrorDTOInterface): ErrorDTOInterface | null;
}
