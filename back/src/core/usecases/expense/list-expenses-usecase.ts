import { PaginatedResponseMeta } from '@/application/dtos/shared/pagination-dto';
import { UserId } from '@/core/entities/user/value-objects/user-id';
import { ExpenseRepositoryInterface } from '@/core/ports/repositories/expense-repository-interface';
import { UserRepositoryInterface } from '@/core/ports/repositories/user-repository-interface';
import {
  ListExpenseOutputDTO,
  ListExpenseOutputProps,
  ListExpensesInputDTO,
} from '@/core/usecases/expense/list-expense-dto';
import { ListExpenseUseCaseInterface } from '@/core/usecases/expense/list-expenses-usecase-interface';

export class ListExpenseUseCase implements ListExpenseUseCaseInterface {
  constructor(
    private readonly expenseRepository: ExpenseRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async execute(
    data: ListExpensesInputDTO,
  ): Promise<ListExpenseOutputDTO> {
    const requestingUserId = UserId.from(data.requestingUserId);

    const requestingUser = this.userRepository.findById(requestingUserId);

    const targetUserId = UserId.from(data.targetUserId);

    const targetUser = this.userRepository.findById(targetUserId);

    const repositoryInput: ListExpensesInputDTO = {
      requestingUserId: requestingUserId.toString(),
      targetUserId: targetUserId.toString(),
    };

    const expenses = await this.expenseRepository.list(repositoryInput);

    const expensesList: ListExpenseOutputProps[] = expenses.map((e) => ({
      name: e.name.value,
      description: e.description?.value || '',
      amount: e.amount.cents,
      currency: e.amount.currency,
      totalAmount: e.totalAmount.cents,
      status: e.status.value,
      tags: e.tags.toArray(),
      currentInstallment: e.installmentInfo.current,
      totalInstallment: e.installmentInfo.total,
      paymentDay: e.paymentSchedule.paymentDay.toISOString(),
      expirationDay: e.paymentSchedule.expirationDay.toISOString(),
      paymentStartAt: e.paymentSchedule.startAt.toISOString(),
      paymentEndAt: e.paymentSchedule.endAt.toISOString(),
    }));

    const paginationMeta: PaginatedResponseMeta = {
      hasNextPage: true,
      hasPreviousPage: false,
      page: 1,
      pageSize: 10,
      totalItems: 10,
      totalPages: 200,
    };

    const output: ListExpenseOutputDTO = {
      meta: paginationMeta,
      data: expensesList,
    };

    return output;
  }
}
