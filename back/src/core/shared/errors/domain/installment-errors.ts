import { DomainError } from "../domain-error";

export class InstallmentError extends DomainError {}

export class InstallmentIdEmptyError extends InstallmentError {
  constructor() {
    super("Installment id cannot be empty");
  }
}

export class InvalidInstallmentIdError extends InstallmentError {
  constructor() {
    super("Installment id must be a valid UUID v4");
  }
}

export class InstallmentNumbersMustBeIntegersError extends InstallmentError {
  constructor() {
    super("Installment numbers must be integers");
  }
}

export class InstallmentNumbersMustBePositiveError extends InstallmentError {
  constructor() {
    super("Installment numbers must be positive");
  }
}

export class CurrentInstallmentExceedsTotalError extends InstallmentError {
  constructor(current: number, total: number) {
    super(`Current installment (${current}) cannot exceed total(${total})`);
  }
}

export class InstallmentTotalExceedsLimitError extends InstallmentError {
  constructor(maxInstallments: number) {
    super(`Total installment cannot exceed ${maxInstallments} months`);
  }
}

export class CannotAdvanceBeyondFinalInstallmentError extends InstallmentError {
  constructor() {
    super("Cannot advance beyond final installment");
  }
}
