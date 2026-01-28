export class PaymentSchedule {
  private readonly MIN_DATE_LIMIT: Date = new Date("1970-01-01");
  private readonly MAX_YEAR_LIMIT: number = 30;

  private constructor(
    private readonly _paymentDay: Date,
    private readonly _expirationDay: Date,
    private readonly _startAt: Date,
    private readonly _endAt: Date,
  ) {
    this.validate();
  }

  public static create(
    paymentDay: Date,
    expirationDay: Date,
    startAt: Date,
    endAt: Date,
  ): PaymentSchedule {
    return new PaymentSchedule(
      new Date(paymentDay),
      new Date(expirationDay),
      new Date(startAt),
      new Date(endAt),
    );
  }

  get paymentDay(): Date {
    return new Date(this._paymentDay);
  }

  get expirationDay(): Date {
    return new Date(this._expirationDay);
  }

  get startAt(): Date {
    return new Date(this._startAt);
  }

  get endAt(): Date {
    return new Date(this._endAt);
  }

  public isExpired(referenceDate: Date = new Date()): boolean {
    return this.stripTime(referenceDate) > this.stripTime(this._expirationDay);
  }

  public isWithinPaymentPeriod(referenceDate: Date = new Date()): boolean {
    const ref = this.stripTime(referenceDate);
    const start = this.stripTime(this._startAt);
    const end = this.stripTime(this._endAt);

    return ref >= start && ref <= end;
  }

  public isPaymentDue(referenceDate: Date = new Date()): boolean {
    const ref = this.stripTime(referenceDate);
    const payment = this.stripTime(this._paymentDay);
    const expiration = this.stripTime(this._expirationDay);

    return ref >= payment && ref <= expiration;
  }

  public daysUntilExpiration(referenceDate: Date = new Date()): number {
    const milliseconds = 1000;
    const seconds = 60;
    const minutes = 60;
    const hours = 24;
    const ref = this.stripTime(referenceDate);
    const expiration = this.stripTime(this.expirationDay);

    const diffMs = expiration.getTime() - ref.getTime();
    return Math.ceil(diffMs / (milliseconds * seconds * minutes * hours));
  }

  public daysUntilPayment(referenceDate: Date = new Date()): number {
    const milliseconds = 1000;
    const seconds = 60;
    const minutes = 60;
    const hours = 24;
    const ref = this.stripTime(referenceDate);
    const payment = this.stripTime(this._paymentDay);

    const diffMs = payment.getTime() - ref.getTime();

    return Math.ceil(diffMs / (milliseconds * seconds * minutes * hours));
  }

  public equals(other: PaymentSchedule): boolean {
    if (!(other instanceof PaymentSchedule)) {
      return false;
    }
    return (
      this._paymentDay.getTime() === other._paymentDay.getTime() &&
      this._expirationDay.getTime() === other._expirationDay.getTime() &&
      this._startAt.getTime() === other._startAt.getTime() &&
      this._endAt.getTime() === other._endAt.getTime()
    );
  }

  private validate(): void {
    this.validateDatesAreValid();
    this.validateLogicalOrder();
    this.validateReasonableDates();
  }

  private validateDatesAreValid(): void {
    const dates = [
      { date: this._paymentDay, name: "Payment day" },
      { date: this._expirationDay, name: "Expiration day" },
      { date: this._startAt, name: "Start date" },
      { date: this._endAt, name: "End date" },
    ];

    dates.forEach(({ date, name }) => {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error(`${name} must be a valid date`);
      }
    });
  }

  private validateLogicalOrder(): void {
    if (this._startAt > this._endAt) {
      throw new Error(
        `Payment period start (${this.formatDate(this._startAt)}) must be before end (${this.formatDate(this._endAt)})`,
      );
    }

    if (this._expirationDay > this._endAt) {
      throw new Error(
        `Expiration day (${this.formatDate(this._expirationDay)}) must be within payment period (${this.formatDate(this._startAt)} to ${this.formatDate(this._endAt)})`,
      );
    }
  }

  private validateReasonableDates(): void {
    const maxDate = new Date();

    maxDate.setFullYear(maxDate.getFullYear() + this.MAX_YEAR_LIMIT);

    const dates = [
      this._paymentDay,
      this._expirationDay,
      this._startAt,
      this._endAt,
    ];

    dates.forEach((date) => {
      if (date < this.MIN_DATE_LIMIT) {
        throw new Error(
          `Date cannot be before year ${this.MIN_DATE_LIMIT.getFullYear()}: ${this.formatDate(date)}`,
        );
      }
      if (date > maxDate) {
        throw new Error(
          `Date cannot be more than ${this.MAX_YEAR_LIMIT} years in the future: ${this.formatDate(date)}`,
        );
      }
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  private stripTime(date: Date): Date {
    const stripped = new Date(date);
    stripped.setHours(0, 0, 0, 0);

    return stripped;
  }

  public toString(): string {
    return `PaymentSchedule(payment: ${this._paymentDay}, expiration: ${this._expirationDay}, period: ${this._startAt} to ${this._endAt}, )`;
  }
}
