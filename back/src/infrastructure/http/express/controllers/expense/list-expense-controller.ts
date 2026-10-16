import { PaginationRequestProps } from '@/application/dtos/shared/pagination-dto';
import { ListExpenseControllerType } from '@/core/ports/infrastructure/http/controllers/expense/list-expense-controller-type';
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from '@/core/shared/types/http-request-response';
import {
  ListExpenseFiltersOptionsProps,
  ListExpenseInputParams,
  ListExpenseOrderRequestOptionalProps,
  ListExpenseOutputDTO,
  ListExpensesInputDTO,
} from '@/core/usecases/expense/list-expense-dto';
import { ListExpenseUseCaseInterface } from '@/core/usecases/expense/list-expenses-usecase-interface';
import {
  ListExpenseFilterOptionsSchema,
  ListExpenseOrderOptionsSchema,
  ListExpenseSchema,
} from '@/infrastructure/validation/zod/schemas/expense/list-expense-schema';
import { PaginationSchema } from '@/infrastructure/validation/zod/schemas/shared/pagination-schema';
import { requestValidation } from '@/infrastructure/validation/zod/validation/request-validation';

export class ListExpenseController implements ListExpenseControllerType {
  constructor(private readonly usecase: ListExpenseUseCaseInterface) {}

  public async handle(
    request: AuthenticatedHttpRequestInterface<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>,
      ListExpenseInputParams
    >,
  ): Promise<AuthenticatedHttpResponseInterface<ListExpenseOutputDTO>> {
    const filters: ListExpenseFiltersOptionsProps = requestValidation(
      'query',
      request,
      ListExpenseFilterOptionsSchema,
    );

    const sorting: ListExpenseOrderRequestOptionalProps = requestValidation(
      'query',
      request,
      ListExpenseOrderOptionsSchema,
    );

    const pagination: PaginationRequestProps = requestValidation(
      'query',
      request,
      PaginationSchema,
    );

    const allFilters: ListExpenseInputParams = requestValidation(
      'query',
      request,
      ListExpenseSchema,
    );

    const data: ListExpensesInputDTO = {
      requestingUserId: request.user.sub,
      filters,
      sorting,
      pagination,
    };

    const expensesList: ListExpenseOutputDTO = await this.usecase.execute(data);

    const output: AuthenticatedHttpResponseInterface<ListExpenseOutputDTO> = {
      statusCode: 200,
      body: expensesList,
    };

    return output;
  }
}
