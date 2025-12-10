import {
  CreateExpenseInputDTO,
  CreateExpenseOutputDTO,
} from "@/core/usecases/expense/create-expense-dto";

export interface CreateExpenseUseCaseInterface {
  execute: (data: CreateExpenseInputDTO) => Promise<CreateExpenseOutputDTO>;
}
