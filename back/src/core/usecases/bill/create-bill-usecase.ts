import { Bill } from "@/core/entities/bill";
import { BillRepositoryInterface } from "@/core/ports/repositories/bill-repository-interface";
import { InternalError } from "@/core/shared/errors/api-errors";
import { billUseCaseErrors } from "@/core/shared/errors/usecases/bill-usecase-errors";
import {
  CreateBillInputDTO,
  CreateBillOutputDTO,
} from "@/core/usecases/bill/create-bill-dto";
import { CreateBillUseCaseInterface } from "@/core/usecases/bill/create-bill-usecase-interface";

export class CreateBillUseCase implements CreateBillUseCaseInterface {
  constructor(private readonly repository: BillRepositoryInterface) {}

  public async execute({
    userId,
    bill,
  }: CreateBillInputDTO): Promise<CreateBillOutputDTO> {
    const newEntityBill = new Bill(bill);

    const output = await this.repository.create({
      userId: userId,
      bill: newEntityBill,
    });

    if (!output) {
      throw new InternalError(
        "Wasn't possible to create bill, try again later!",
        {},
        billUseCaseErrors.E_0_BLU_ADM_0001.code
      );
    }

    return output;
  }
}
