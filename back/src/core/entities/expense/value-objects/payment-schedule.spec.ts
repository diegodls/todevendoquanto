import { PaymentSchedule } from "@/core/entities/expense/value-objects/payment-schedule";
import { describe, expect, it } from "vitest";

describe("PaymentSchedule", () => {
  const validDates = {
    paymentDay: new Date("2026-01-15"),
    expirationDay: new Date("2026-01-20"),
    startAt: new Date("2026-01-01"),
    endAt: new Date("2026-01-31"),
  };

  describe("create", () => {
    it("should create valid payment schedule", () => {
      const schedule = PaymentSchedule.create(
        validDates.paymentDay,
        validDates.expirationDay,
        validDates.startAt,
        validDates.endAt,
      );

      expect(schedule.paymentDay).toEqual(validDates.paymentDay);
      expect(schedule.expirationDay).toEqual(validDates.expirationDay);
      expect(schedule.startAt).toEqual(validDates.startAt);
      expect(schedule.endAt).toEqual(validDates.endAt);
    });

    it("should create copies of dates to prevent mutation", () => {
      const paymentDay = new Date("2026-01-15");
      const expirationDay = new Date("2026-01-20");
      const startDay = new Date("2026-01-01");
      const endAt = new Date("2026-01-31");

      const schedule = PaymentSchedule.create(
        paymentDay,
        expirationDay,
        startDay,
        endAt,
      );

      paymentDay.setFullYear(2099);
      expirationDay.setFullYear(2099);

      expect(paymentDay.getFullYear()).toBe(2099);
      expect(expirationDay.getFullYear()).toBe(2099);
      expect(schedule.paymentDay.getFullYear()).toBe(2026);
      expect(schedule.expirationDay.getFullYear()).toBe(2026);
    });
  });

  describe("getters", () => {
    it("should return payment day", () => {
      const schedule = PaymentSchedule.create(
        validDates.paymentDay,
        validDates.expirationDay,
        validDates.startAt,
        validDates.endAt,
      );

      expect(schedule.paymentDay).toEqual(validDates.paymentDay);
    });

    it("should return copies to prevent mutation", () => {
      const schedule = PaymentSchedule.create(
        validDates.paymentDay,
        validDates.expirationDay,
        validDates.startAt,
        validDates.endAt,
      );
      const paymentDay = schedule.paymentDay;
      paymentDay.setFullYear(2099);

      expect(schedule.paymentDay.getFullYear()).toBe(2026);
    });

    it("should return new instance on each getter call", () => {
      const schedule = PaymentSchedule.create(
        validDates.paymentDay,
        validDates.expirationDay,
        validDates.startAt,
        validDates.endAt,
      );
      const date1 = schedule.paymentDay;
      const date2 = schedule.paymentDay;

      expect(date1).not.toBe(date2);
      expect(date1).toEqual(date2);
    });
  });

  describe("validation errors", () => {
    it("should throw error when start date is after end date", () => {
      expect(() =>
        PaymentSchedule.create(
          new Date("2026-01-15"),
          new Date("2026-01-20"),
          new Date("2026-01-31"),
          new Date("2026-01-01"),
        ),
      ).toThrow(
        "Payment period start (2026-01-31) must be before end (2026-01-01)",
      );
    });

    it("should throw error on invalid date", () => {
      expect(() =>
        PaymentSchedule.create(
          new Date("invalid"),
          validDates.expirationDay,
          validDates.startAt,
          validDates.endAt,
        ),
      ).toThrow("must be a valid date");
    });

    it("should throw error on date before 1970", () => {
      expect(() =>
        PaymentSchedule.create(
          new Date("1969-12-31"),
          new Date("1970-12-31"),
          new Date("1970-12-31"),
          new Date("1970-12-31"),
        ),
      ).toThrow("Date cannot be before year");
    });

    it("should throw erro on date more than 30 year in future", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 31);

      expect(() =>
        PaymentSchedule.create(futureDate, futureDate, futureDate, futureDate),
      ).toThrow(`Date cannot be more than 30 years in the future`);
    });
  });

  describe("isExpired", () => {
    it("should return false when expiration is in future", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-06-15"),
        new Date("2026-06-20"),
        new Date("2026-06-01"),
        new Date("2026-06-30"),
      );

      const referenceDate = new Date("2026-06-10");

      expect(schedule.isExpired(referenceDate)).toBe(false);
    });

    it("should return false on expiration day itself", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );

      const referenceDate = new Date("2026-01-20");

      expect(schedule.isExpired(referenceDate)).toBe(false);
    });

    it(" ignore time component", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15T10:00:00"),
        new Date("2026-01-20T15:00:00"),
        new Date("2026-01-01T08:00:00"),
        new Date("2026-01-31T23:59:59"),
      );

      const referenceDate = new Date("2026-01-20T23:59:59");

      expect(schedule.isExpired(referenceDate)).toBe(false);
    });

    it("should use current date when reference not provided", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const schedule = PaymentSchedule.create(
        tomorrow,
        nextMonth,
        new Date(),
        nextMonth,
      );

      expect(schedule.isExpired()).toBe(false);
    });
  });

  describe("isWithinPaymentPeriod", () => {
    it("should return true when within period", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );

      const referenceDate = new Date("2026-01-15");

      expect(schedule.isWithinPaymentPeriod(referenceDate)).toBe(true);
    });

    it("should return true on start date", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );

      const referenceDate = new Date("2026-01-01");

      expect(schedule.isWithinPaymentPeriod(referenceDate)).toBe(true);
    });

    it("return true on end date", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );

      const referenceDate = new Date("2026-01-31");
      expect(schedule.isWithinPaymentPeriod(referenceDate)).toBe(true);
    });

    it("should return false before period", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );

      const referenceDate = new Date("2025-15-31");

      expect(schedule.isWithinPaymentPeriod(referenceDate)).toBe(false);
    });

    it("should return false after period", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );

      const referenceDate = new Date("2026-02-01");

      expect(schedule.isWithinPaymentPeriod(referenceDate)).toBe(false);
    });
  });

  describe("isPaymentDue", () => {
    it("should return true on payment day", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );

      const referenceDate = new Date("2026-01-15");

      expect(schedule.isPaymentDue(referenceDate)).toBe(true);
    });

    it("should return true between payment and expiration", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );

      const referenceDate = new Date("2026-01-18");

      expect(schedule.isPaymentDue(referenceDate)).toBe(true);
    });

    it("should return true on expiration day", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );

      const referenceDate = new Date("2026-01-20");

      expect(schedule.isPaymentDue(referenceDate)).toBe(true);
    });

    it("should return false before payment day", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );

      const referenceDate = new Date("2026-01-10");

      expect(schedule.isPaymentDue(referenceDate)).toBe(false);
    });

    it(" return false after expiration", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );

      const referenceDate = new Date("2026-01-25");

      expect(schedule.isPaymentDue(referenceDate)).toBe(false);
    });
  });

  describe("daysUntilExpiration", () => {
    it("should calculate days until expiration", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );

      const referenceDate = new Date("2026-01-15");

      expect(schedule.daysUntilExpiration(referenceDate)).toBe(5);
    });

    it("should return 0 on expiration day", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );

      const referenceDate = new Date("2026-01-20");

      expect(schedule.daysUntilExpiration(referenceDate)).toBe(0);
    });

    it("should return negative for past expiration", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );

      const referenceDate = new Date("2026-01-25");

      expect(schedule.daysUntilExpiration(referenceDate)).toBe(-5);
    });
  });

  describe("daysUntilPayment", () => {
    it("should calculate days until payment", () => {
      const schedule = PaymentSchedule.create(
        new Date("2026-01-15"),
        new Date("2026-01-20"),
        new Date("2026-01-01"),
        new Date("2026-01-31"),
      );
      const referenceDate = new Date("2026-01-10");

      expect(schedule.daysUntilExpiration(referenceDate)).toBe(5);
    });
  });
});
