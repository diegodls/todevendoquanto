export class Money {
  private static readonly VALID_CURRENCIES = ["BRL", "USD"];
  private static readonly DEFAULT_CURRENCY = "BRL";

  private constructor(
    private readonly _cents: number,
    private readonly _currency: string = Money.DEFAULT_CURRENCY,
  ) {
    if (_cents < 0) {
      throw new Error("Money amount cannot be negative");
    }

    if (!Number.isFinite(_cents)) {
      throw new Error("Money amount must be a valid number");
    }

    if (!_currency || _currency.trim().length === 0) {
      throw new Error("Currency cannot be empty");
    }

    if (!Money.VALID_CURRENCIES.includes(_currency)) {
      throw new Error(`Invalid currency: ${_currency}`);
    }
  }

  public static create(cents: number, currency?: string): Money {
    if (!Number.isInteger(cents)) {
      return new Money(
        cents * 100,
        currency?.toUpperCase() || Money.DEFAULT_CURRENCY,
      );
    }

    return new Money(cents, currency?.toUpperCase() || Money.DEFAULT_CURRENCY);
  }

  public static zero(currency?: string): Money {
    return new Money(0, currency?.toUpperCase() || Money.DEFAULT_CURRENCY);
  }

  get decimal(): number {
    return this._cents / 100;
  }

  get cents(): number {
    return this._cents;
  }

  get currency(): string {
    return this._currency;
  }

  public isZero(): boolean {
    return this._cents === 0;
  }

  public isPositive(): boolean {
    return this._cents > 0;
  }

  public isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._cents > other._cents;
  }

  public isGreaterThanOrEqual(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._cents >= other._cents;
  }

  public isLessThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._cents < other._cents;
  }

  public isLessThanOrEqual(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._cents <= other._cents;
  }

  public equals(other: Money): boolean {
    if (!(other instanceof Money)) {
      return false;
    }
    return this._cents === other._cents && this._currency === other._currency;
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._cents + other._cents, this._currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);

    const result = this._cents - other._cents;

    if (result < 0) {
      throw new Error(
        `Subtraction would result in negative amount: ${this.cents} - ${other._cents} = ${this.cents - other._cents}`,
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

    return new Money(this._cents * factor, this._currency);
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

    return new Money(this._cents / divisor, this.currency);
  }

  public split(parts: number): Money[] {
    if (!Number.isInteger(parts) || parts <= 0) {
      throw new Error("The split quantity must be a integer positive");
    }

    const base = Math.floor(this.cents / parts);

    if (base <= 0) {
      throw new Error(
        `Is not possible to split ${this.decimal} in ${parts} parts`,
      );
    }

    const remainder = this.cents % parts;

    return Array.from({ length: parts }, (_, i) =>
      Money.create(i < remainder ? base + 1 : base, this._currency),
    );
  }

  public static sum(moneys: Money[]): number {
    return moneys.reduce((acc, m) => acc + m.cents, 0);
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

      results.push(Money.create(share, this._currency));
    });

    return results;
  }

  public toString(): string {
    return `${this._currency} ${this._cents.toFixed(2)}`;
  }

  public toJSON(): { amount: number; currency: string } {
    return {
      amount: this._cents,
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
