import { DomainError } from "../domain-error";

export class ExpenseStatusError extends DomainError {}

export class InvalidExpenseStatusError extends ExpenseStatusError {
  constructor(value: string, validValues: string[]) {
    super(
      `Invalid status: "${value}". Accepted values: ${validValues.join(", ")}`,
    );
  }
}

export class InvalidExpenseStatusTransitionError extends ExpenseStatusError {
  constructor(current: string, next: string) {
    super(`Invalid transition: ${current} → ${next}`);
  }
}
