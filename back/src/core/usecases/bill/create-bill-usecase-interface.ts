import {
  CreateBillOutputDTO,
  CreateBillUseCaseProps,
} from "@/core/usecases/bill/create-bill-dto";

export interface CreateBillUseCaseInterface {
  execute: (data: CreateBillUseCaseProps) => Promise<CreateBillOutputDTO>;
}
