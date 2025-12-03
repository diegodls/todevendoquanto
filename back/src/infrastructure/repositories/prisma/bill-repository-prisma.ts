import { BillRepositoryInterface } from "@/core/ports/repositories/bill-repository-interface";
import {
  CreateBillOutputDTO,
  CreateBillUseCaseProps,
} from "@/core/usecases/bill/create-bill-dto";
import { PrismaClientGenerated } from "@/infrastructure/repositories/prisma/config/prisma-client";

export class BillRepositoryPrisma implements BillRepositoryInterface {
  constructor(private readonly prismaORMClient: PrismaClientGenerated) {}

  create({
    userId,
    bill,
  }: CreateBillUseCaseProps): Promise<CreateBillOutputDTO> {
    const output = this.prismaORMClient.bill.create({
      data: { ...bill, userId },
    });

    return output;
  }
}
