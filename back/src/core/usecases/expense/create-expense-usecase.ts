import { Expense } from "@/core/entities/expense/expense";
import { DateProviderInterface } from "@/core/ports/infrastructure/protocols/date/date-provider-interface";
import { GenerateUuidInterface } from "@/core/ports/infrastructure/protocols/uuid/generate-uuid-interface";
import { ExpenseRepositoryInterface } from "@/core/ports/repositories/expense-repository-interface";
import { InternalError } from "@/core/shared/errors/api-errors";
import { expenseUseCaseErrors } from "@/core/shared/errors/usecases/expense-usecase-errors";
import {
  CreateExpenseInputDTO,
  CreateExpenseOutputDTO,
} from "@/core/usecases/expense/create-expense-dto";
import { CreateExpenseUseCaseInterface } from "@/core/usecases/expense/create-expense-usecase-interface";

export class CreateExpenseUseCase implements CreateExpenseUseCaseInterface {
  constructor(
    private readonly repository: ExpenseRepositoryInterface,
    private readonly generateUuid: GenerateUuidInterface,
    private readonly dateProvider: DateProviderInterface,
  ) {}

  public async execute(
    userId: string,
    expense: CreateExpenseInputDTO,
  ): Promise<CreateExpenseOutputDTO[]> {
    const expensesToCreate: Expense[] = [];

    const installmentId = this.generateUuid.execute();

    for (let i = 0; i < expense.totalInstallments; i++) {
      const currentInstallment = i + 1;

      const paymentDay =
        expense.status === "PAYING"
          ? this.dateProvider.addMonthStrict(expense.paymentDay, i)
          : expense.paymentDay;

      const expirationDay = this.dateProvider.addMonthStrict(
        expense.expirationDay,
        i,
      );

      const paymentStartAt = this.dateProvider.addMonthStrict(
        expense.paymentStartAt,
        i,
      );

      const paymentEndAt = this.dateProvider.addMonthStrict(
        expense.paymentEndAt,
        i,
      );

      const expenseToBeCreated = Expense.create({
        ...expense,
        currentInstallment,
        paymentDay,
        expirationDay,
        paymentStartAt,
        paymentEndAt,
        userId,
        installmentId,
      });

      expensesToCreate.push(expenseToBeCreated);
    }

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
