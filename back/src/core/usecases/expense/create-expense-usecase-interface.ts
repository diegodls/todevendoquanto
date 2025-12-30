import {
  CreateExpenseOutputDTO,
  CreateExpenseUseCaseInput,
} from "@/core/usecases/expense/create-expense-dto";

export interface CreateExpenseUseCaseInterface {
  execute: (data: CreateExpenseUseCaseInput) => Promise<CreateExpenseOutputDTO>;
}
