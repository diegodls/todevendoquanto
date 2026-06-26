import { PaginationDTO } from '@/application/dtos/shared/pagination-dto';
import { Expense } from '@/core/entities/expense/expense';
import { CreateExpenseOutputDTO } from '@/core/usecases/expense/create-expense-dto';
import { ListExpensesInputDTO } from '@/core/usecases/expense/list-expense-dto';

export interface ExpenseRepositoryInterface {
  findInstallmentById: (
    id: Expense['installmentId'],
  ) => Promise<Expense[] | null>;
  create: (expenses: Expense[]) => Promise<CreateExpenseOutputDTO[]>;
  deleteByInstallmentId: (id: Expense['installmentId']) => Promise<void>;
  list: (
    data: ListExpensesInputDTO,
    pagination: PaginationDTO,
  ) => Promise<Expense[]>;
}
