import { DomainError } from "@/core/shared/errors/domain/domain-error";

export class ExpenseAdvancePaidInstallmentError extends DomainError {}
export class ExpenseAdvanceAbandonedInstallmentError extends DomainError {}
export class ExpenseAdvanceBeyondFinalInstallmentError extends DomainError {}
export class ExpenseInstallmentSplitError extends DomainError {}
export class ExpenseUserIdRequiredError extends DomainError {}
export class ExpenseInstallmentIdRequiredError extends DomainError {}
export class ExpenseCurrencyMismatchError extends DomainError {}
export class ExpensePaidInstallmentInvariantError extends DomainError {}
export class ExpenseCannotPayAbandonedError extends DomainError {}
export class ExpenseInstallmentNotCompleteError extends DomainError {}
