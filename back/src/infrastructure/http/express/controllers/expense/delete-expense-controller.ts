import { DeleteExpenseControllerType } from "@/core/ports/infrastructure/http/controllers/expense/delete-expense-controller-type";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import { DeleteExpenseParamsInput } from "@/core/usecases/expense/delete-expense-dto";
import { DeleteExpenseUseCaseInterface } from "@/core/usecases/expense/delete-expense-usecase-interface";
import { DeleteExpenseByIdSchema } from "@/infrastructure/validation/zod/schemas/expense/delete-expense-by-id-schema";
import { schemaParser } from "@/infrastructure/validation/zod/validation/schema-parser";

export class DeleteExpenseController implements DeleteExpenseControllerType {
  constructor(private readonly usecase: DeleteExpenseUseCaseInterface) {}
  public async handle(
    request: AuthenticatedHttpRequestInterface<
      {},
      {},
      DeleteExpenseParamsInput,
      {}
    >
  ): Promise<AuthenticatedHttpResponseInterface<{}>> {
    const user = request.user;

    const { id } = schemaParser(request.params, DeleteExpenseByIdSchema, "");

    await this.usecase.execute(id, user.sub);

    const output: AuthenticatedHttpResponseInterface<{}> = {
      statusCode: 204,
      body: {},
    };
    return output;
  }
}
