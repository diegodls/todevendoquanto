import {
  ExpenseNameEmptyError,
  ExpenseNameTooLongError,
  ExpenseNameTooShortError,
  ExpenseNameWhitespaceError,
} from "@/core/shared/errors/domain/expense-value-object-errors";

export class ExpenseName {
  private constructor(private readonly _value: string) {
    if (_value.length < 3) {
      throw new ExpenseNameTooShortError(
        "Expense name must have at least 3 characters",
      );
    }

    if (_value.length > 100) {
      throw new ExpenseNameTooLongError(
        "Expense name cannot exceed 100 characters",
      );
    }
  }

  public static create(name?: string): ExpenseName {
    if (!name) {
      throw new ExpenseNameEmptyError("Expense name cannot be empty");
    }

    const trimmed = name.trim();

    if (trimmed.length === 0) {
      throw new ExpenseNameWhitespaceError(
        "Expense name cannot be empty or whitespace",
      );
    }

    return new ExpenseName(trimmed);
  }

  get value(): string {
    return this._value;
  }

  public equals(other: ExpenseName): boolean {
    if (!(other instanceof ExpenseName)) {
      return false;
    }

    return other._value === this._value;
  }
}
