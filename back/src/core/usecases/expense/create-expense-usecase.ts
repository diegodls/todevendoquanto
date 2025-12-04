import { Expense } from "@/core/entities/expense";
import { ExpenseRepositoryInterface } from "@/core/ports/repositories/expense-repository-interface";
import { InternalError } from "@/core/shared/errors/api-errors";
import { expenseUseCaseErrors } from "@/core/shared/errors/usecases/expense-usecase-errors";
import {
  CreateExpenseOutputDTO,
  CreateExpenseUseCaseProps,
} from "@/core/usecases/expense/create-expense-dto";
import { CreateExpenseUseCaseInterface } from "@/core/usecases/expense/create-expense-usecase-interface";

export class CreateExpenseUseCase implements CreateExpenseUseCaseInterface {
  constructor(private readonly repository: ExpenseRepositoryInterface) {}

  public async execute({
    userId,
    expense,
  }: CreateExpenseUseCaseProps): Promise<CreateExpenseOutputDTO> {
    const newEntityExpense = new Expense(expense);

    const output = await this.repository.create({
      userId: userId,
      expense: newEntityExpense,
    });

    if (!output) {
      throw new InternalError(
        "Wasn't possible to create expense, try again later!",
        {},
        expenseUseCaseErrors.E_0_BLU_ADM_0001.code
      );
    }

    return output;
  }
}
