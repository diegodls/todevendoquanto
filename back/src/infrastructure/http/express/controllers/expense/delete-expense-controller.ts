import { DeleteExpenseControllerType } from "@/core/ports/infrastructure/http/controllers/expense/delete-expense-controller-type";
import { UnauthorizedError } from "@/core/shared/errors/api-errors";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import {
  DeleteExpenseInputDTO,
  DeleteExpenseParamsInput,
} from "@/core/usecases/expense/delete-expense-dto";
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
    >,
  ): Promise<AuthenticatedHttpResponseInterface<{}>> {
    const user = request.user;

    if (!user || !user.sub) {
      throw new UnauthorizedError("Requesting user data wasn't send");
    }

    const { id } = schemaParser(
      request.params,
      DeleteExpenseByIdSchema,
      "params",
    );

    const data: DeleteExpenseInputDTO = {
      requestingUserId: user.sub,
      installmentId: id,
    };

    await this.usecase.execute(data);

    const output: AuthenticatedHttpResponseInterface<{}> = {
      statusCode: 204,
      body: {},
    };
    return output;
  }
}
