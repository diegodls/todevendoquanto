import { ErrorDTOInterface } from "@/core/ports/infrastructure/http/controllers/error/error-controller-interface";

export interface ErrorServiceInterface {
  execute(data: ErrorDTOInterface): ErrorDTOInterface | null;
}
