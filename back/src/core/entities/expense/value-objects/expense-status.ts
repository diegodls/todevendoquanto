import {
  InvalidExpenseStatusError,
  InvalidExpenseStatusTransitionError,
} from "@/core/shared/errors/domain/expense-value-object-errors";

export enum ExpenseStatusValue {
  PAYING = "PAYING",
  PAID = "PAID",
  ABANDONED = "ABANDONED",
}

type AllowedTransitions = {
  [key in ExpenseStatusValue]: ExpenseStatusValue[];
};

const ALLOWED_TRANSITIONS: AllowedTransitions = {
  [ExpenseStatusValue.PAYING]: [
    ExpenseStatusValue.PAID,
    ExpenseStatusValue.ABANDONED,
  ],
  [ExpenseStatusValue.PAID]: [],
  [ExpenseStatusValue.ABANDONED]: [],
};

export class ExpenseStatus {
  private _value: ExpenseStatusValue;

  private constructor(value: ExpenseStatusValue) {
    this._value = value;
  }

  static paying(): ExpenseStatus {
    return new ExpenseStatus(ExpenseStatusValue.PAYING);
  }

  static fromString(value: string): ExpenseStatus {
    const valid = Object.values(ExpenseStatusValue).find(
      (status) => status === value.toLocaleUpperCase(),
    );

    if (!valid) {
      throw new InvalidExpenseStatusError(
        `Invalid status: "${value}". Accepted values: ${Object.values(ExpenseStatusValue).join(", ")}`,
      );
    }

    return new ExpenseStatus(valid);
  }

  public transitionTo(next: ExpenseStatusValue): ExpenseStatus {
    const allowed = ALLOWED_TRANSITIONS[this._value];

    if (!allowed.includes(next)) {
      throw new InvalidExpenseStatusTransitionError(
        `Invalid transition: ${this._value} -> ${next}`,
      );
    }

    return new ExpenseStatus(next);
  }

  get value(): ExpenseStatusValue {
    return this._value;
  }

  public isPaying(): boolean {
    return this._value === ExpenseStatusValue.PAYING;
  }

  public isPaid(): boolean {
    return this._value === ExpenseStatusValue.PAID;
  }

  public isAbandoned(): boolean {
    return this._value === ExpenseStatusValue.ABANDONED;
  }

  public equals(other: ExpenseStatus): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
