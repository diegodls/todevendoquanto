import { ListExpenseOutput } from '@/core/usecases/expense/list-expense-dto';

export interface ListExpenseUseCaseInterface {
  execute(): ListExpenseOutput;
}
