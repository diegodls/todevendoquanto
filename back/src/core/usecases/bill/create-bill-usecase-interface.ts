import {
  CreateBillInputDTO,
  CreateBillOutputDTO,
} from "@/core/usecases/bill/create-bill-dto";

export interface CreateBillUseCaseInterface {
  execute: (data: CreateBillInputDTO) => Promise<CreateBillOutputDTO>;
}
