import { DomainError } from "../domain-error";

export class ExpenseDescriptionError extends DomainError {}

export class ExpenseDescriptionEmptyError extends ExpenseDescriptionError {
  constructor() {
    super("Description cannot be empty or whitespace.");
  }
}

export class ExpenseDescriptionTooLongError extends ExpenseDescriptionError {
  constructor(maxLength: number) {
    super(`Description cannot exceed ${maxLength} characters.`);
  }
}

export class ExpenseDescriptionContainsHtmlError extends ExpenseDescriptionError {
  constructor() {
    super("Description cannot contain HTML tags.");
  }
}
