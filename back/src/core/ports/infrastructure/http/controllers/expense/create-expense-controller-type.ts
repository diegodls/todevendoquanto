import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";
import {
  CreateExpenseBodyInput,
  CreateExpenseOutputDTO,
} from "@/core/usecases/expense/create-expense-dto";

export type CreateExpenseControllerType = AuthenticatedControllerInterface<
  CreateExpenseBodyInput,
  {},
  {},
  {},
  CreateExpenseOutputDTO
>;
