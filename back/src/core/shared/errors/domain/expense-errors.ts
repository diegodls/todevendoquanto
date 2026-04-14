import { DomainError } from "../domain-error";

export class ExpenseError extends DomainError {}

export class CannotAdvancePaidExpenseInstallmentError extends ExpenseError {
  constructor() {
    super("Cannot advance installment of paid expense");
  }
}

export class CannotAdvanceAbandonedExpenseInstallmentError extends ExpenseError {
  constructor() {
    super("Cannot advance installment of abandoned expense");
  }
}

export class CannotAdvanceFinalExpenseInstallmentError extends ExpenseError {
  constructor() {
    super("Cannot advance: already at final installment");
  }
}

export class ExpenseUserRequiredError extends ExpenseError {
  constructor() {
    super("Expense must belong to a user");
  }
}

export class ExpenseInstallmentIdRequiredError extends ExpenseError {
  constructor() {
    super("Expense must have an installment ID");
  }
}

export class ExpenseAmountCurrencyMismatchError extends ExpenseError {
  constructor(amountCurrency: string, totalAmountCurrency: string) {
    super(
      `Amount and totalAmount must have same currency: ${amountCurrency} vs ${totalAmountCurrency}`,
    );
  }
}

export class PaidExpenseInstallmentIncompleteError extends ExpenseError {
  constructor(current: number, total: number) {
    super(`Expense marked as PAID but installment is ${current}/${total}`);
  }
}

export class ExpenseCannotBePaidBeforeFinalInstallmentError extends ExpenseError {
  constructor(current: number, total: number) {
    super(
      `Cannot mark as paid: installment ${current}/${total} is not complete`,
    );
  }
}
