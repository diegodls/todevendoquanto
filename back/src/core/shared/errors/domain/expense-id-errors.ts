import { DomainError } from "../domain-error";

export class ExpenseIdError extends DomainError {}

export class ExpenseIdEmptyError extends ExpenseIdError {
  constructor() {
    super("Expense id cannot be empty");
  }
}

export class InvalidExpenseIdError extends ExpenseIdError {
  constructor() {
    super("Expense id must be a valid UUID v4");
  }
}
