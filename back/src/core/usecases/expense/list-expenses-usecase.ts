import {
  PaginatedResponseMeta,
  PaginationDTO,
} from '@/application/dtos/shared/pagination-dto';
import { UserId } from '@/core/entities/user/value-objects/user-id';
import { ExpenseRepositoryInterface } from '@/core/ports/repositories/expense-repository-interface';
import { UserRepositoryInterface } from '@/core/ports/repositories/user-repository-interface';
import {
  NotFoundError,
  UnauthorizedError,
} from '@/core/shared/errors/api-errors';
import {
  ListExpenseFiltersOptions,
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

    const targetUserId = UserId.from(data.targetUserId);

    const [requestingUser, targetUser] = await Promise.all([
      this.userRepository.findById(requestingUserId),
      this.userRepository.findById(targetUserId),
    ]);

    if (!requestingUser) {
      throw new NotFoundError('User not found.');
    }

    if (!targetUser) {
      throw new NotFoundError('A user ID must be provided.');
    }

    if (
      !requestingUser.isAdmin() &&
      requestingUser.id.toString() !== targetUser.id.toString()
    ) {
      throw new UnauthorizedError(
        "You don't have the permissions to list this expense.",
      );
    }

    if (!requestingUser.isAdmin() && targetUser.isAdmin()) {
      throw new UnauthorizedError(
        "You don't have the permissions to list this expense.",
      );
    }

    const input: ListExpensesInputDTO = {
      requestingUserId: requestingUserId.toString(),
      targetUserId: targetUserId.toString(),
    };

    const pagination = this.buildPagination(data);

    const filters = this.buildFilters(data);

    const repositoryData = await this.expenseRepository.list(
      input,
      pagination,
      filters,
    );

    const expensesList: ListExpenseOutputProps[] = repositoryData.data.map(
      (e) => {
        if (e.userId.toString() !== targetUserId.toString()) {
          throw new UnauthorizedError(
            "You don't have the permissions to list this expense.",
          );
        }

        return {
          userId: e.userId.toString(),
          installmentId: e.installmentId.toString(),
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
        };
      },
    );

    const paginationMeta: PaginatedResponseMeta = this.buildMetaPagination(
      pagination,
      repositoryData.total,
    );

    const output: ListExpenseOutputDTO = {
      meta: paginationMeta,
      data: expensesList,
    };

    return output;
  }

  private buildPagination(data: ListExpensesInputDTO): PaginationDTO {
    const defaultPagination: PaginationDTO = {
      page: 1,
      pageSize: 10,
    };

    if (data.page && data.page > 0) {
      defaultPagination.page = data.page;
    }

    if (data.pageSize && data.pageSize > 0 && data.pageSize <= 100) {
      defaultPagination.pageSize = data.pageSize;
    }

    if (data.pageSize && data.pageSize > 100) {
      defaultPagination.pageSize = 100;
    }

    return defaultPagination;
  }

  private buildMetaPagination(
    data: PaginationDTO,
    totalItems: number,
  ): PaginatedResponseMeta {
    const totalPages = Math.ceil(totalItems / data.pageSize);

    const page = data.pageSize < totalItems ? data.page : 1;

    const pageSize = data.pageSize;

    const hasPreviousPage = page > 1;

    const hasNextPage = page < totalPages;

    const meta: PaginatedResponseMeta = {
      page,
      pageSize,
      hasPreviousPage,
      hasNextPage,
      totalItems,
      totalPages,
    };
    return meta;
  }

  private buildFilters(data: ListExpensesInputDTO): ListExpenseFiltersOptions {
    const filters: ListExpenseFiltersOptions = {};

    if (data.name?.trim()) {
      filters.name = data.name;
    }

    if (data.installmentId?.trim()) {
      filters.installmentId = data.installmentId;
    }

    return filters;
  }
}
