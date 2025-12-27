import { AuthenticatedControllerInterface } from "@/core/ports/infrastructure/http/controllers/authenticated-controller-interface";
import {
  DeleteExpenseOutputDTO,
  DeleteExpenseParamsInput,
} from "@/core/usecases/expense/delete-expense-dto";

export type DeleteExpenseControllerType = AuthenticatedControllerInterface<
  {},
  {},
  DeleteExpenseParamsInput,
  {},
  DeleteExpenseOutputDTO
>;
