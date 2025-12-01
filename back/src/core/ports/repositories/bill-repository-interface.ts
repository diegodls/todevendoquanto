import {
  CreateBillInputDTO,
  CreateBillOutputDTO,
} from "@/core/usecases/bill/create-bill-dto";

export interface BillRepositoryInterface {
  create: (input: CreateBillInputDTO) => Promise<CreateBillOutputDTO>;
}
