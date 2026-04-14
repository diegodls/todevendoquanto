import { DomainError } from "../domain-error";

export class PaymentScheduleError extends DomainError {}

export class InvalidPaymentScheduleDateError extends PaymentScheduleError {
  constructor(name: string) {
    super(`${name} must be a valid date`);
  }
}

export class PaymentPeriodStartAfterEndError extends PaymentScheduleError {
  constructor(startAt: string, endAt: string) {
    super(`Payment period start (${startAt}) must be before end (${endAt})`);
  }
}

export class ExpirationDayOutsidePaymentPeriodError extends PaymentScheduleError {
  constructor(expirationDay: string, startAt: string, endAt: string) {
    super(
      `Expiration day (${expirationDay}) must be within payment period (${startAt} to ${endAt})`,
    );
  }
}

export class PaymentScheduleDateBeforeMinimumError extends PaymentScheduleError {
  constructor(minYear: number, date: string) {
    super(`Date cannot be before year ${minYear}: ${date}`);
  }
}

export class PaymentScheduleDateTooFarInFutureError extends PaymentScheduleError {
  constructor(maxYears: number, date: string) {
    super(`Date cannot be more than ${maxYears} years in the future: ${date}`);
  }
}
