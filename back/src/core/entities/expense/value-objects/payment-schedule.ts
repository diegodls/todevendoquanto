export class PaymentSchedule {
  private constructor(
    private readonly _paymentDay: Date,
    private readonly _expirationDay: Date,
    private readonly _startAt: Date,
    private readonly _endAt: Date
  ) {
    if (_startAt > _endAt) {
      throw new Error("Payment period must be before expiration day");
    }
  }

  public static create(
    paymentDay: Date,
    expirationDay: Date,
    startAt: Date,
    endAt: Date
  ): PaymentSchedule {
    return new PaymentSchedule(paymentDay, expirationDay, startAt, endAt);
  }

  get paymentDay(): Date {
    return this._paymentDay;
  }

  get expirationDay(): Date {
    return this._expirationDay;
  }

  get startAt(): Date {
    return this._startAt;
  }

  get endAt(): Date {
    return this._endAt;
  }

  public isExpired(): boolean {
    return new Date() > this._expirationDay;
  }

  public isWithinPaymentPeriod(): boolean {
    const now = new Date();
    return now >= this._startAt && now < this._endAt;
  }
}
