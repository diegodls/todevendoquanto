import {
  ListExpenseOutputDTO,
  ListExpensesInputDTO,
} from '@/core/usecases/expense/list-expense-dto';

export interface ListExpenseUseCaseInterface {
  execute(data: ListExpensesInputDTO): Promise<ListExpenseOutputDTO>;
}
