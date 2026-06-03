import { PaginatedResponseMeta } from '@/application/dtos/shared/pagination-dto';
import { ExpenseRepositoryInterface } from '@/core/ports/repositories/expense-repository-interface';
import {
  ListExpenseOutputDTO,
  ListExpensesInputDTO,
} from '@/core/usecases/expense/list-expense-dto';
import { ListExpenseUseCaseInterface } from '@/core/usecases/expense/list-expenses-usecase-interface';

export class ListExpenseUseCase implements ListExpenseUseCaseInterface {
  constructor(private readonly repository: ExpenseRepositoryInterface) {}

  public async execute(
    data: ListExpensesInputDTO,
  ): Promise<ListExpenseOutputDTO> {
    const expenses = this.repository.list(data);
    const paginationMeta: PaginatedResponseMeta = {};

    const output: ListExpenseOutputDTO = {
      meta: paginationMeta,
      data: {},
    };

    return output;
  }
}
