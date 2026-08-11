import {
  PaginatedResponseMeta,
  PaginationDTO,
  PaginationRequestProps,
} from '@/application/dtos/shared/pagination-dto';
import { ExpenseDescription } from '@/core/entities/expense/value-objects/expense-description';
import { ExpenseName } from '@/core/entities/expense/value-objects/expense-name';
import { ExpenseStatus } from '@/core/entities/expense/value-objects/expense-status';
import { InstallmentId } from '@/core/entities/expense/value-objects/installment-id';
import { InstallmentInfo } from '@/core/entities/expense/value-objects/installment-info';
import { Money } from '@/core/entities/expense/value-objects/money';
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
  ListExpenseOutputDTO,
  ListExpenseOutputProps,
  ListExpenseRequestDataProps,
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

    const input: ListExpenseRequestDataProps = {
      requestingUserId,
      targetUserId,
    };

    const pagination = this.buildPagination(data);

    const filters = this.buildFilters(data);

    const sorting = this.buildSorting(data);

    const repositoryData = await this.expenseRepository.list(
      input,
      pagination,
      filters,
      sorting,
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

  private buildFilters(
    data: ListExpensesInputDTO,
  ): ListExpenseFiltersOptionsProps {
    const filters: ListExpenseFiltersOptionsProps = {};

    if (data.name?.trim()) {
      filters.name = ExpenseName.create(data.name);
    }

    if (data.installmentId?.trim()) {
      filters.installmentId = InstallmentId.from(data.installmentId);
    }

    if (data.created_before) {
      filters.created_before = new Date(data.created_before);
    }

    if (data.created_after) {
      filters.created_after = new Date(data.created_after);
    }

    if (data.updated_before) {
      filters.updated_before = new Date(data.updated_before);
    }

    if (data.updated_after) {
      filters.updated_after = new Date(data.updated_after);
    }

    if (data.description?.trim()) {
      filters.description = ExpenseDescription.create(data.description);
    }

    if (data.amount_min !== undefined) {
      filters.amount_min = Money.create(Number(data.amount_min));
    }

    if (data.amount_max !== undefined) {
      filters.amount_max = Money.create(Number(data.amount_max));
    }

    if (data.currency && data.currency.length > 0) {
      filters.currency = data.currency
        .split(',')
        .map((c) => c.trim().toUpperCase());
    }

    if (data.totalAmount_min !== undefined) {
      filters.totalAmount_min = Money.create(Number(data.totalAmount_min));
    }

    if (data.totalAmount_max !== undefined) {
      filters.totalAmount_max = Money.create(Number(data.totalAmount_max));
    }

    if (data.status && data.status.length > 0) {
      filters.status = data.status
        .split(',')
        .map((c) => ExpenseStatus.fromString(c.trim().toUpperCase()));
    }

    if (data.currentInstallment && data.currentInstallment.length > 0) {
      filters.currentInstallment = data.currentInstallment
        .split(',')
        .map((c) => InstallmentInfo.create(Number(c.trim()), Number(c.trim())));
    }

    if (data.totalInstallment && data.totalInstallment.length > 0) {
      filters.totalInstallment = data.totalInstallment
        .split(',')
        .map((c) => InstallmentInfo.create(1, Number(c.trim())));
    }

    if (data.paymentDay_before) {
      filters.paymentDay_before = new Date(data.paymentDay_before);
    }

    if (data.paymentDay_after) {
      filters.paymentDay_after = new Date(data.paymentDay_after);
    }

    if (data.expirationDay_before) {
      filters.expirationDay_before = new Date(data.expirationDay_before);
    }

    if (data.expirationDay_after) {
      filters.expirationDay_after = new Date(data.expirationDay_after);
    }

    if (data.paymentStartAt_before) {
      filters.paymentStartAt_before = new Date(data.paymentStartAt_before);
    }

    if (data.paymentStartAt_after) {
      filters.paymentStartAt_after = new Date(data.paymentStartAt_after);
    }

    if (data.paymentEndAt_before) {
      filters.paymentEndAt_before = new Date(data.paymentEndAt_before);
    }

    if (data.paymentEndAt_after) {
      filters.paymentEndAt_after = new Date(data.paymentEndAt_after);
    }

    return filters;
  }

  private buildSorting(
    data: ListExpensesInputDTO,
  ): ListExpenseOrderRequestOptionalOptions {
    const sorting: ListExpenseOrderRequestOptionalOptions = {
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
