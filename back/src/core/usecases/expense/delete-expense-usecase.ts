import { Expense } from "@/core/entities/expense";
import { User } from "@/core/entities/user";
import { ExpenseRepositoryInterface } from "@/core/ports/repositories/expense-repository-interface";
import { UserRepositoryInterface } from "@/core/ports/repositories/user-repository-interface";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/core/shared/errors/api-errors";
import { deleteExpenseUseCaseErrors } from "@/core/shared/errors/usecases/expense-usecase-errors";
import { DeleteExpenseUseCaseInterface } from "@/core/usecases/expense/delete-expense-usecase-interface";

export class DeleteExpenseUseCase implements DeleteExpenseUseCaseInterface {
  constructor(
    private readonly expenseRepository: ExpenseRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}
  async execute(id: Expense["id"], userId: User["id"]): Promise<void> {
    const expenseExists = await this.expenseRepository.findById(id);

    if (!expenseExists) {
      throw new NotFoundError(
        `Expense not found with ID provided: ${id}`,
        {},
        deleteExpenseUseCaseErrors.E_0_DEU_NFE_0001.code
      );
    }

    const user = await this.userRepository.findById(userId);

    const userCanDelete =
      user && (user.id === expenseExists.userId || user?.role === "ADMIN");

    if (!userCanDelete) {
      throw new UnauthorizedError(
        "You can't delete this expense!",
        {},
        deleteExpenseUseCaseErrors.E_0_DEU_NFE_0002.code
      );
    }

    await this.expenseRepository.delete(id);
  }
}
