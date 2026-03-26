import { CreateExpenseInput, Expense } from "@/core/entities/expense/expense";
import { ExpenseDescription } from "@/core/entities/expense/value-objects/expense-description";
import { ExpenseName } from "@/core/entities/expense/value-objects/expense-name";
import { ExpenseStatus } from "@/core/entities/expense/value-objects/expense-status";
import { InstallmentId } from "@/core/entities/expense/value-objects/installment-id";
import { InstallmentInfo } from "@/core/entities/expense/value-objects/installment-info";
import { Money } from "@/core/entities/expense/value-objects/money";
import { PaymentSchedule } from "@/core/entities/expense/value-objects/payment-schedule";
import { Tags } from "@/core/entities/expense/value-objects/tags";
import { UserId } from "@/core/entities/user/value-objects/user-id";
import { ExpenseRepositoryInterface } from "@/core/ports/repositories/expense-repository-interface";
import { InternalError } from "@/core/shared/errors/api-errors";
import { expenseUseCaseErrors } from "@/core/shared/errors/usecases/expense-usecase-errors";
import {
  CreateExpenseInputDTO,
  CreateExpenseOutputDTO,
} from "@/core/usecases/expense/create-expense-dto";
import { CreateExpenseUseCaseInterface } from "@/core/usecases/expense/create-expense-usecase-interface";

export class CreateExpenseUseCase implements CreateExpenseUseCaseInterface {
  constructor(private readonly repository: ExpenseRepositoryInterface) {}

  public async execute(
    userId: string,
    input: CreateExpenseInputDTO,
  ): Promise<CreateExpenseOutputDTO[]> {
    const installmentIdCreated: InstallmentId = InstallmentId.create();

    const userIdCreated: UserId = UserId.from(userId);

    const name: ExpenseName = ExpenseName.create(input.name);

    const description: ExpenseDescription | null = input.description
      ? ExpenseDescription.create(input.description)
      : null;

    const amount: Money = input.amount
      ? Money.create(input.amount, input.currency)
      : Money.zero();

    const totalAmount: Money = input.totalAmount
      ? Money.create(input.totalAmount, input.currency)
      : Money.zero();

    const tags: Tags = Tags.create(input.tags);

    const status: ExpenseStatus = input.status
      ? ExpenseStatus.fromString(input.status)
      : ExpenseStatus.paying();

    const installmentInfo: InstallmentInfo = InstallmentInfo.create(
      input.currentInstallment ?? 1,
      input.totalInstallment ?? 1,
    );

    const paymentSchedule: PaymentSchedule = PaymentSchedule.create(
      input.paymentDay || new Date(),
      input.expirationDay || new Date(),
      input.paymentStartAt || new Date(),
      input.paymentEndAt || new Date(),
    );

    const expenseInput: CreateExpenseInput = {
      name,
      description,
      amount,
      totalAmount,
      status,
      tags,
      installmentInfo,
      paymentSchedule,
      userId: userIdCreated,
      installmentId: installmentIdCreated,
    };

    const expensesToCreate: Expense[] = Expense.splitIntoInstallments({
      ...expenseInput,
      userId: userIdCreated,
      installmentId: installmentIdCreated,
    });

    const output = await this.repository.create(expensesToCreate);

    if (!output || output.length !== expensesToCreate.length) {
      throw new InternalError(
        "Wasn't possible to create expense, try again later!",
        {},
        expenseUseCaseErrors.E_0_BLU_ADM_0001.code,
      );
    }

    return output;
  }
}
