import {
  PaginatedResult,
  PaginationDTO,
} from '@/application/dtos/shared/pagination-dto';
import { Expense } from '@/core/entities/expense/expense';
import { CreateExpenseOutputDTO } from '@/core/usecases/expense/create-expense-dto';
import {
  ListExpenseFiltersOptionsProps,
  ListExpenseRequestDataProps,
} from '@/core/usecases/expense/list-expense-dto';

export interface ExpenseRepositoryInterface {
  findInstallmentById: (
    id: Expense['installmentId'],
  ) => Promise<Expense[] | null>;
  create: (expenses: Expense[]) => Promise<CreateExpenseOutputDTO[]>;
  deleteByInstallmentId: (id: Expense['installmentId']) => Promise<void>;
  list: (
    data: ListExpenseRequestDataProps,
    pagination: PaginationDTO,
    filters: ListExpenseFiltersOptionsProps,
  ) => Promise<PaginatedResult<Expense>>;
}
