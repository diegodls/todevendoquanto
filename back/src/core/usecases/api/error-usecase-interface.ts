import {
  ApiErrorInputDTO,
  ApiErrorOutputDTO,
} from "@/core/ports/infrastructure/http/controllers/error/error-controller-interface";

export interface ErrorServiceInterface {
  execute(data: ApiErrorInputDTO): ApiErrorOutputDTO;
}
