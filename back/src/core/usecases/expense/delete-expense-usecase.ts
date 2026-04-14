import { InstallmentId } from "@/core/entities/expense/value-objects/installment-id";
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

export class DeleteExpenseUseCase implements DeleteExpenseUseCaseInterface {
  constructor(
    private readonly expenseRepository: ExpenseRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
  ) {}
  async execute(data: DeleteExpenseInputDTO): Promise<void> {
    const installmentId = InstallmentId.from(data.installmentId);

    const existingExpenses =
      await this.expenseRepository.findInstallmentById(installmentId);

    if (!existingExpenses || existingExpenses.length === 0) {
      throw new NotFoundError(
        `Expense not found with ID provided: ${installmentId.toString()}`,
        {},
        deleteExpenseUseCaseErrors.E_0_DEU_NFE_0001.code,
      );
    }

    const requestingUserId = UserId.from(data.requestingUserId);

    const expenseOwnerUserId = existingExpenses[0].userId;

    const user = await this.userRepository.findById(requestingUserId);

    if (!user) {
      throw new NotFoundError(
        `User not fount with the following id: $${requestingUserId.toString()}`,
        {},
        deleteExpenseUseCaseErrors.E_0_DEU_NFE_0003.code,
      );
    }

    const userCanDelete =
      user && (user.id.equals(expenseOwnerUserId) || user.canDeleteContent());

    if (!userCanDelete) {
      throw new UnauthorizedError(
        "You can't delete this expense!",
        {},
        deleteExpenseUseCaseErrors.E_0_DEU_NFE_0002.code,
      );
    }

    await this.expenseRepository.deleteByInstallmentId(installmentId);
  }
}
