import { ExpenseId } from "@/core/entities/expense/value-objects/expense-id";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import { ExpenseRepositoryInterface } from "@/core/ports/repositories/expense-repository-interface";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/errors/api-errors";
import { deleteExpenseUseCaseErrors } from "@/core/shared/errors/usecases/expense-usecase-errors";
import { DeleteExpenseInputDTO } from "@/core/usecases/expense/delete-expense-dto";
import { DeleteExpenseUseCaseInterface } from "@/core/usecases/expense/delete-expense-usecase-interface";
import { id } from "zod/locales";

export class DeleteExpenseUseCase implements DeleteExpenseUseCaseInterface {
  constructor(
    private readonly expenseRepository: ExpenseRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
  ) {}
  async execute(data: DeleteExpenseInputDTO): Promise<void> {
    const expenseId = ExpenseId.from(data.expenseId);

    const expenseExists = await this.expenseRepository.findById(expenseId);

    if (!expenseExists) {
      throw new NotFoundError(
        `Expense not found with ID provided: ${id}`,
        {},
        deleteExpenseUseCaseErrors.E_0_DEU_NFE_0001.code,
      );
    }

    const requestingUserId = UserId.from(data.requestingUserId);

    const user = await this.userRepository.findById(requestingUserId);

    const userCanDelete =
      user && (user.id === expenseExists.userId || user.canDeleteContent());

    if (!userCanDelete) {
      throw new UnauthorizedError(
        "You can't delete this expense!",
        {},
        deleteExpenseUseCaseErrors.E_0_DEU_NFE_0002.code,
      );
    }

    await this.expenseRepository.delete(expenseId);
  }
}
