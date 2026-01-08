import {
  CreateExpenseInputDTO,
  CreateExpenseOutputDTO,
} from "@/core/usecases/expense/create-expense-dto";

export interface CreateExpenseUseCaseInterface {
  execute: (
    userId: string,
    expense: CreateExpenseInputDTO
  ) => Promise<CreateExpenseOutputDTO[]>;
}
