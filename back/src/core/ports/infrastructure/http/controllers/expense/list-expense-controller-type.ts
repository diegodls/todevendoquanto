import { AuthenticatedControllerInterface } from '@/core/ports/infrastructure/http/controllers/authenticated-controller-interface';
import {
  ListExpenseInputParams,
  ListExpenseOutputDTO,
} from '@/core/usecases/expense/list-expense-dto';

export type ListExpenseControllerType = AuthenticatedControllerInterface<
  {},
  {},
  {},
  ListExpenseInputParams,
  ListExpenseOutputDTO
>;
