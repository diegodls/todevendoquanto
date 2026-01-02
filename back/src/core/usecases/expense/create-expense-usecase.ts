import { Expense } from "@/core/entities/expense";
import { DateProviderInterface } from "@/core/ports/infrastructure/protocols/date/date-provider-interface";
import { GenerateUuidInterface } from "@/core/ports/infrastructure/protocols/uuid/generate-uuid-interface";
import { ExpenseRepositoryInterface } from "@/core/ports/repositories/expense-repository-interface";
import { InternalError } from "@/core/shared/errors/api-errors";
import { expenseUseCaseErrors } from "@/core/shared/errors/usecases/expense-usecase-errors";
import {
  CreateExpenseOutputDTO,
  CreateExpenseUseCaseInput,
} from "@/core/usecases/expense/create-expense-dto";
import { CreateExpenseUseCaseInterface } from "@/core/usecases/expense/create-expense-usecase-interface";

export class CreateExpenseUseCase implements CreateExpenseUseCaseInterface {
  constructor(
    private readonly repository: ExpenseRepositoryInterface,
    private readonly generateUuid: GenerateUuidInterface,
    private readonly dateProvider: DateProviderInterface
  ) {}

  public async execute({
    userId,
    expense,
  }: CreateExpenseUseCaseInput): Promise<CreateExpenseOutputDTO> {
    const expensesToCreate: Expense[] = [];

    const currentInstallmentId = this.generateUuid.execute();

    for (let i = 0; i < expense.totalInstallment; i++) {
      let expenseToBeCreated = new Expense(expense);

      expenseToBeCreated.userId = userId;

      expenseToBeCreated.installmentId = currentInstallmentId;

      expenseToBeCreated.actualInstallment = i + 1;

      if (expense.status === "PAYING") {
        expenseToBeCreated.paymentDay = this.dateProvider.addMonthStrict(
          expense.paymentDay,
          i
        );
      }

      expenseToBeCreated.expirationDay = this.dateProvider.addMonthStrict(
        expense.expirationDay,
        i
      );

      expenseToBeCreated.paymentStartAt = this.dateProvider.addMonthStrict(
        expense.paymentStartAt,
        i
      );

      expenseToBeCreated.paymentEndAt = this.dateProvider.addMonthStrict(
        expense.paymentEndAt,
        i
      );

      expensesToCreate.push(expenseToBeCreated);
    }

    const output = await this.repository.create(expensesToCreate);

    if (!output || output.length !== expensesToCreate.length) {
      throw new InternalError(
        "Wasn't possible to create expense, try again later!",
        {},
        expenseUseCaseErrors.E_0_BLU_ADM_0001.code
      );
    }

    return output;
  }
}
