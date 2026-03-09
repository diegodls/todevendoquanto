export class ExpenseId {
  private readonly _value: string;

  private constructor(id: string) {
    this._value = id;
  }

  public static create(): ExpenseId {
    return new ExpenseId(crypto.randomUUID());
  }

  public static from(id: string): ExpenseId {
    if (!id || id.trim().length === 0) {
      throw new Error("Expense id cannot be empty");
    }

    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidV4Regex.test(id)) {
      throw new Error("Expense id must be a valid UUID v4");
    }

    return new ExpenseId(id);
  }

  public toString(): string {
    return this._value;
  }

  public equals(other: ExpenseId): boolean {
    if (!other) return false;
    return this._value === other._value;
  }
}
