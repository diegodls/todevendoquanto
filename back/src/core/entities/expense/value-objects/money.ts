export class Money {
  private static readonly VALID_CURRENCIES = ["BRL", "USD"];
  private static readonly DEFAULT_CURRENCY = "BRL";

  private constructor(
    private readonly _amount: number,
    private readonly _currency: string = Money.DEFAULT_CURRENCY,
  ) {
    if (_amount < 0) {
      throw new Error("Money amount cannot be negative");
    }

    if (!Number.isFinite(_amount)) {
      throw new Error("Money amount must be a valid number");
    }

    if (!_currency || _currency.trim().length === 0) {
      throw new Error("Currency cannot be empty");
    }

    if (!Money.VALID_CURRENCIES.includes(_currency)) {
      throw new Error(`Invalid currency: ${_currency}`);
    }
  }

  public static create(amount: number, currency?: string): Money {
    return new Money(amount, currency?.toUpperCase() || Money.DEFAULT_CURRENCY);
  }

  public static fromCents(cents: number, currency?: string): Money {
    if (!Number.isInteger(cents)) {
      throw new Error("Cents must be a integer");
    }

    if (cents < 0) {
      throw new Error("Cents cannot be negative");
    }

    const amount = cents / 100;

    return new Money(amount, currency?.toUpperCase() || Money.DEFAULT_CURRENCY);
  }

  public static zero(currency?: string): Money {
    return new Money(0, currency?.toUpperCase() || Money.DEFAULT_CURRENCY);
  }

  get cents(): number {
    return Math.round(this._amount * 100);
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  public isZero(): boolean {
    return this._amount === 0;
  }

  public isPositive(): boolean {
    return this._amount > 0;
  }

  public isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._amount > other._amount;
  }

  public isGreaterThanOrEqual(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._amount >= other._amount;
  }

  public isLessThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._amount < other._amount;
  }

  public isLessThanOrEqual(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._amount <= other._amount;
  }

  public equals(other: Money): boolean {
    if (!(other instanceof Money)) {
      return false;
    }
    return this._amount === other._amount && this._currency === other._currency;
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._amount + other._amount, this._currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);

    const result = this._amount - other._amount;

    if (result < 0) {
      throw new Error(
        `Subtraction would result in negative amount: ${this.amount} - ${other._amount} = ${this.amount - other._amount}`,
      );
    }
    return new Money(result, this._currency);
  }

  public multiply(factor: number): Money {
    if (!Number.isFinite(factor)) {
      throw new Error("Multiplication factor must be a finite number");
    }

    if (factor < 0) {
      throw new Error("Multiplication factor cannot be negative");
    }

    return new Money(this._amount * factor, this._currency);
  }

  public divide(divisor: number): Money {
    if (!Number.isFinite(divisor)) {
      throw new Error("Divisor factor must be a finite number");
    }

    if (divisor === 0) {
      throw new Error("Cannot divide by zero");
    }

    if (divisor < 0) {
      throw new Error("Divisor cannot be negative");
    }

    return new Money(this._amount / divisor, this.currency);
  }

  public allocate(ratios: number[]): Money[] {
    if (ratios.length === 0) {
      throw new Error("Ratios array cannot be empty");
    }

    const totalRatio = ratios.reduce((sum, ratio) => sum + ratio, 0);

    if (totalRatio === 0) {
      throw new Error("Total of ratios cannot be zero");
    }

    const totalCents = this.cents;

    let allocated = 0;

    const results: Money[] = [];

    ratios.forEach((ratio, index) => {
      if (ratio < 0) {
        throw new Error("Ratios cannot be negative");
      }

      let share: number = 0;

      if (index === ratios.length - 1) {
        share = totalCents - allocated;
      } else {
        share = Math.floor((totalCents * ratio) / totalRatio);
        allocated += share;
      }

      results.push(Money.fromCents(share, this._currency));
    });

    return results;
  }

  public toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }

  public toJSON(): { amount: number; currency: string } {
    return {
      amount: this._amount,
      currency: this._currency,
    };
  }

  private assertSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new Error(
        `Cannot operate on different currencies: ${this._currency} vs ${other._currency}`,
      );
    }
  }
}
