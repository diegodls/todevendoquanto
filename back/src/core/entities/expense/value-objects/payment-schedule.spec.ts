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

  describe("createMonthly", () => {
    it("should create monthly schedule with valid day", () => {
      const schedule = PaymentSchedule.createMonthly(2026, 1, 15);
    });
  });
});
