export class Money {
  private constructor(
    private readonly _amount: number,
    private readonly _currency: string = "BRL"
  ) {
    if (_amount < 0) {
      throw new Error("Monet amount cannot be negative");
    }

    if (!Number.isFinite(_amount)) {
      throw new Error("Monet amount must be a valid number");
    }
  }

  public static create(amount: number, currency?: string): Money {
    return new Money(amount, currency);
  }

  public static fromCents(cents: number, currency?: string): Money {
    const amount = Math.round(cents / 100);
    return new Money(amount, currency);
  }

  get cents(): number {
    return this._amount * 100;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  public isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._amount > other._amount;
  }

  public equals(other: Money): boolean {
    return this._amount == other._amount && this._currency == other._currency;
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._amount + other._amount, this._currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._amount - other._amount, this._currency);
  }

  public multiply(factor: number): Money {
    return new Money(this._amount * factor, this._currency);
  }

  private assertSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new Error(
        `Cannot operate on different currencies: ${this._currency} vs ${other._currency}`
      );
    }
  }
}
