import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";
import {
  CreateExpenseInputDTO,
  CreateExpenseOutputDTO,
} from "@/core/usecases/expense/create-expense-dto";

export type CreateExpenseControllerType = AuthenticatedControllerInterface<
  CreateExpenseInputDTO,
  {},
  {},
  {},
  CreateExpenseOutputDTO
>;
