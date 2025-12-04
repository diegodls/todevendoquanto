import {
  CreateExpenseOutputDTO,
  CreateExpenseUseCaseProps,
} from "@/core/usecases/expense/create-expense-dto";

export interface ExpenseRepositoryInterface {
  create: (input: CreateExpenseUseCaseProps) => Promise<CreateExpenseOutputDTO>;
}
