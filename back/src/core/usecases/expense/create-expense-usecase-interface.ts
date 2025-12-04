import {
  CreateExpenseOutputDTO,
  CreateExpenseUseCaseProps,
} from "@/core/usecases/expense/create-expense-dto";

export interface CreateExpenseUseCaseInterface {
  execute: (data: CreateExpenseUseCaseProps) => Promise<CreateExpenseOutputDTO>;
}
