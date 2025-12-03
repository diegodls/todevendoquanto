import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";
import {
  CreateBillInputDTO,
  CreateBillOutputDTO,
} from "@/core/usecases/bill/create-bill-dto";

export type CreateBillControllerType = AuthenticatedControllerInterface<
  CreateBillInputDTO,
  {},
  {},
  {},
  CreateBillOutputDTO
>;
