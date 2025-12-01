import { BillRepositoryInterface } from "@/core/ports/repositories/bill-repository-interface";
import {
  CreateBillInputDTO,
  CreateBillOutputDTO,
} from "@/core/usecases/bill/create-bill-dto";
import { PrismaClientGenerated } from "@/infrastructure/repositories/prisma/config/prisma-client";

export class BillRepositoryPrisma implements BillRepositoryInterface {
  constructor(private readonly prismaORMClient: PrismaClientGenerated) {}

  create({ userId, bill }: CreateBillInputDTO): Promise<CreateBillOutputDTO> {
    const output = this.prismaORMClient.bill.create({
      data: { ...bill, userId },
    });

    return output;
  }
}
