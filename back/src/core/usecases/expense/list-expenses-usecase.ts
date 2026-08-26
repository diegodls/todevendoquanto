import {
  PaginatedResponseMeta,
  PaginationDTO,
  PaginationRequestProps,
} from '@/application/dtos/shared/pagination-dto';
import { UserId } from '@/core/entities/user/value-objects/user-id';
import { ExpenseRepositoryInterface } from '@/core/ports/repositories/expense-repository-interface';
import { UserRepositoryInterface } from '@/core/ports/repositories/user-repository-interface';
import {
  NotFoundError,
  UnauthorizedError,
} from '@/core/shared/errors/api-errors';
import {
  ListExpenseFiltersOptionsProps,
  ListExpenseOrderRequestOptionalOptions,
  ListExpenseOrderRequestOptions,
  ListExpenseOutputDTO,
  ListExpenseOutputProps,
  ListExpenseRequestBodyProps,
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
    const requestingUserId = UserId.from(data.body.requestingUserId);

    const targetUserId = UserId.from(data.body.targetUserId);

    const [requestingUser, targetUser] = await Promise.all([
      this.userRepository.findById(requestingUserId),
      this.userRepository.findById(targetUserId),
    ]);

    if (!requestingUser) {
      throw new NotFoundError('User not found.');
    }

    if (!targetUser) {
      throw new NotFoundError('User not found.');
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

    const input: ListExpenseRequestBodyProps = {
      requestingUserId,
      targetUserId,
    };

    const pagination = this.buildPagination(data.pagination);

    const filters: ListExpenseFiltersOptionsProps = data.filters;

    const sorting = this.buildSorting(data.sorting);

    const repositoryData = await this.expenseRepository.list(
      input,
      filters,
      sorting,
      pagination,
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

  private buildPagination(data: PaginationRequestProps): PaginationDTO {
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

  private buildSorting(
    data: ListExpenseOrderRequestOptionalOptions,
  ): ListExpenseOrderRequestOptions {
    const sorting: ListExpenseOrderRequestOptions = {
      order: 'asc',
      orderBy: 'name',
    };

    if (data.order) {
      sorting.order = data.order;
    }

    if (data.orderBy) {
      sorting.orderBy = data.orderBy;
    }

    return sorting;
  }
}
