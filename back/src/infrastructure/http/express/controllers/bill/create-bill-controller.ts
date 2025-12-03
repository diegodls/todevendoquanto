import { Bill } from "@/core/entities/bill";
import { CreateBillControllerType } from "@/core/ports/infrastructure/http/controllers/bill/create-bill-controller-type";
import {
  AuthenticatedHttpRequestInterface,
  AuthenticatedHttpResponseInterface,
} from "@/core/shared/types/http-request-response";
import { CreateBillInputDTO } from "@/core/usecases/bill/create-bill-dto";
import { CreateBillUseCase } from "@/core/usecases/bill/create-bill-usecase";
import { CreateBillBodySchema } from "@/infrastructure/validation/zod/schemas/bill/create-bill-body-schema";
import { requestValidation } from "@/infrastructure/validation/zod/validation/request-validation";

export class CreateBillController implements CreateBillControllerType {
  constructor(private readonly usecase: CreateBillUseCase) {}

  async handle(
    request: AuthenticatedHttpRequestInterface<CreateBillInputDTO, {}, {}, {}>
  ): Promise<AuthenticatedHttpResponseInterface<Bill>> {
    const user = request.user;

    const input = requestValidation("body", request, CreateBillBodySchema);

    const createdBill = await this.usecase.execute({
      userId: user.sub,
      bill: input,
    });

    const output: AuthenticatedHttpResponseInterface<Bill> = {
      statusCode: 200,
      body: createdBill,
    };

    return output;
  }
}
