import { Expense } from "@/core/entities/expense";
import { CreateExpenseControllerType } from "@/core/ports/infrastructure/http/controllers/expense/create-expense-controller-type";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import { CreateExpenseBodyInput } from "@/core/usecases/expense/create-expense-dto";
import { CreateExpenseUseCase } from "@/core/usecases/expense/create-expense-usecase";
import { CreateExpenseBodySchema } from "@/infrastructure/validation/zod/schemas/expense/create-expense-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";

export class CreateExpenseController implements CreateExpenseControllerType {
  constructor(private readonly usecase: CreateExpenseUseCase) {}

  async handle(
    request: AuthenticatedHttpRequestInterface<
      CreateExpenseBodyInput,
      {},
      {},
      {}
    >
  ): Promise<AuthenticatedHttpResponseInterface<Expense[]>> {
    const user = request.user;

    const input = requestValidation("body", request, CreateExpenseBodySchema);

    const createdExpense = await this.usecase.execute({
      userId: user.sub,
      expense: input,
    });

    const output: AuthenticatedHttpResponseInterface<Expense[]> = {
      statusCode: 200,
      body: createdExpense,
    };

    return output;
  }
}
