import { Expense } from "@/core/entities/expense/expense";
import { InstallmentId } from "@/core/entities/expense/value-objects/installment-id";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import { ExpenseRepositoryInterface } from "@/core/ports/repositories/expense-repository-interface";
import { InternalError } from "@/core/shared/errors/api-errors";
import { expenseUseCaseErrors } from "@/core/shared/errors/usecases/expense-usecase-errors";
import {
  CreateExpenseInputDTO,
  CreateExpenseOutputDTO,
} from "@/core/usecases/expense/create-expense-dto";
import { CreateExpenseUseCaseInterface } from "@/core/usecases/expense/create-expense-usecase-interface";

export class CreateExpenseUseCase implements CreateExpenseUseCaseInterface {
  constructor(private readonly repository: ExpenseRepositoryInterface) {}

  public async execute(
    userId: string,
    expense: CreateExpenseInputDTO,
  ): Promise<CreateExpenseOutputDTO[]> {
    const installmentIdCreated = InstallmentId.create();

    const userIdCreated = UserId.from(userId);

    const newExpense = Expense.create({
      ...expense,
      userId: userIdCreated,
      installmentId: installmentIdCreated,
    });

    const expensesToCreate: Expense[] = newExpense.splitIntoInstallments();

    return [
      {
        name: "string;",
        description: "string;",
        amount: 2,
        currency: "string;",
        totalAmount: 2,
        status: "string;",
        tags: [],
        currentInstallment: 1,
        totalInstallment: 1,
        paymentDay: "string;",
        expirationDay: "string;",
        paymentStartAt: "string;",
        paymentEndAt: "string;",
      },
    ];

    const output = await this.repository.create(expensesToCreate);

    if (!output || output.length !== expensesToCreate.length) {
      throw new InternalError(
        "Wasn't possible to create expense, try again later!",
        {},
        expenseUseCaseErrors.E_0_BLU_ADM_0001.code,
      );
    }

    return output;
  }
}
