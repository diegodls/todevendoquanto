import {
  ExpenseNameBlankError,
  ExpenseNameEmptyError,
  ExpenseNameTooLongError,
  ExpenseNameTooShortError,
} from "@/core/shared/errors/domain";

export class ExpenseName {
  private constructor(private readonly _value: string) {
    if (_value.length < 3) {
      throw new ExpenseNameTooShortError();
    }

    if (_value.length > 100) {
      throw new ExpenseNameTooLongError();
    }
  }

  public static create(name?: string): ExpenseName {
    if (!name) {
      throw new ExpenseNameEmptyError();
    }

    const trimmed = name.trim();

    if (trimmed.length === 0) {
      throw new ExpenseNameBlankError();
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
