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
  private readonly value: ExpenseStatusValue;

  private constructor(value: ExpenseStatusValue) {
    this.value = value;
  }

  static paying(): ExpenseStatus {
    return new ExpenseStatus(ExpenseStatusValue.PAYING);
  }

  static fromString(value: string): ExpenseStatus {
    const valid = Object.values(ExpenseStatusValue).find(
      (v) => v === value.toLocaleUpperCase(),
    );

    if (!valid) {
      throw new Error(
        `Invalid status: "${value}". Accepted values: ${Object.values(ExpenseStatusValue).join(", ")}`,
      );
    }

    return new ExpenseStatus(valid);
  }

  public transitionTo(next: ExpenseStatusValue): ExpenseStatus {
    const allowed = ALLOWED_TRANSITIONS[this.value];

    if (!allowed.includes(next)) {
      throw new Error(`Invalid transition: ${this.value} → ${next}`);
    }

    return new ExpenseStatus(next);
  }

  public isPaying(): boolean {
    return this.value === ExpenseStatusValue.PAYING;
  }
  public isPaid(): boolean {
    return this.value === ExpenseStatusValue.PAID;
  }
  public isAbandoned(): boolean {
    return this.value === ExpenseStatusValue.ABANDONED;
  }

  public equals(other: ExpenseStatus): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
