import {
  PaginatedResult,
  PaginationDTO,
} from '@/application/dtos/shared/pagination-dto';
import { Expense } from '@/core/entities/expense/expense';
import { CreateExpenseOutputDTO } from '@/core/usecases/expense/create-expense-dto';
import {
  ListExpenseFiltersOptionsProps,
  ListExpenseOrderRequestOptionalProps,
  ListExpenseRequestBodyProps,
} from '@/core/usecases/expense/list-expense-dto';

export interface ExpenseRepositoryInterface {
  findInstallmentById: (
    id: Expense['installmentId'],
  ) => Promise<Expense[] | null>;
  create: (expenses: Expense[]) => Promise<CreateExpenseOutputDTO[]>;
  deleteByInstallmentId: (id: Expense['installmentId']) => Promise<void>;
  list: (
    data: ListExpenseRequestBodyProps,
    filters: ListExpenseFiltersOptionsProps,
    sorting: ListExpenseOrderRequestOptionalProps,
    pagination: PaginationDTO,
  ) => Promise<PaginatedResult<Expense>>;
}
