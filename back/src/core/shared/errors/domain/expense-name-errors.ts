import { DomainError } from "../domain-error";

export class ExpenseNameError extends DomainError {}

export class ExpenseNameEmptyError extends ExpenseNameError {
  constructor() {
    super("Expense name cannot be empty");
  }
}

export class ExpenseNameBlankError extends ExpenseNameError {
  constructor() {
    super("Expense name cannot be empty or whitespace");
  }
}

export class ExpenseNameTooShortError extends ExpenseNameError {
  constructor() {
    super("Expense name must have at least 3 characters");
  }
}

export class ExpenseNameTooLongError extends ExpenseNameError {
  constructor() {
    super("Expense name cannot exceed 100 characters");
  }
}
