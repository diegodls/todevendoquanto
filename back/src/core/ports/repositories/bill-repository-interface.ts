import {
  CreateBillOutputDTO,
  CreateBillUseCaseProps,
} from "@/core/usecases/bill/create-bill-dto";

export interface BillRepositoryInterface {
  create: (input: CreateBillUseCaseProps) => Promise<CreateBillOutputDTO>;
}
