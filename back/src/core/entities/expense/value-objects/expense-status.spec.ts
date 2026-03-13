import {
  ExpenseStatus,
  ExpenseStatusValue,
} from "@/core/entities/expense/value-objects/expense-status";

import { describe, expect, it } from "vitest";

describe("ExpenseStatus", () => {
  describe("paying() — initial factory", () => {
    it("should create a PAYING status", () => {
      const status = ExpenseStatus.paying();
      expect(status.isPaying()).toBe(true);
    });

    it("isPaid and isAbandoned should be false", () => {
      const status = ExpenseStatus.paying();
      expect(status.isPaid()).toBe(false);
      expect(status.isAbandoned()).toBe(false);
    });

    it('toString should return "PAYING"', () => {
      expect(ExpenseStatus.paying().toString()).toBe("PAYING");
    });
  });

  describe("fromString() — persistence reconstitution", () => {
    it('should accept "PAYING"', () => {
      const status = ExpenseStatus.fromString("PAYING");
      expect(status.isPaying()).toBe(true);
    });

    it('should accept "PAID"', () => {
      const status = ExpenseStatus.fromString("PAID");
      expect(status.isPaid()).toBe(true);
    });

    it('should accept "ABANDONED"', () => {
      const status = ExpenseStatus.fromString("ABANDONED");
      expect(status.isAbandoned()).toBe(true);
    });

    it("should throw for an invalid string", () => {
      expect(() => ExpenseStatus.fromString("PENDING")).toThrow(
        'Invalid status: "PENDING"',
      );
    });

    it("should throw for an empty string", () => {
      expect(() => ExpenseStatus.fromString("")).toThrow('Invalid status: ""');
    });

    it("the error message should list the accepted values", () => {
      expect(() => ExpenseStatus.fromString("INVALID")).toThrow(
        "Accepted values: PAYING, PAID, ABANDONED",
      );
    });
  });

  describe("transitionTo() — valid transitions", () => {
    it("PAYING → PAID should be allowed", () => {
      const status = ExpenseStatus.paying().transitionTo(
        ExpenseStatusValue.PAID,
      );
      expect(status.isPaid()).toBe(true);
    });

    it("PAYING → ABANDONED should be allowed", () => {
      const status = ExpenseStatus.paying().transitionTo(
        ExpenseStatusValue.ABANDONED,
      );
      expect(status.isAbandoned()).toBe(true);
    });

    it("should return a new instance without mutating the original — immutability", () => {
      const original = ExpenseStatus.paying();
      const next = original.transitionTo(ExpenseStatusValue.PAID);

      expect(original.isPaying()).toBe(true); // original unchanged
      expect(next.isPaid()).toBe(true);
      expect(original).not.toBe(next);
    });
  });

  describe("transitionTo() — invalid transitions", () => {
    it("PAID → PAYING should throw", () => {
      const paid = ExpenseStatus.fromString("PAID");
      expect(() => paid.transitionTo(ExpenseStatusValue.PAYING)).toThrow(
        "Invalid transition: PAID → PAYING",
      );
    });

    it("PAID → ABANDONED should throw", () => {
      const paid = ExpenseStatus.fromString("PAID");
      expect(() => paid.transitionTo(ExpenseStatusValue.ABANDONED)).toThrow(
        "Invalid transition: PAID → ABANDONED",
      );
    });

    it("ABANDONED → PAYING should throw", () => {
      const abandoned = ExpenseStatus.fromString("ABANDONED");
      expect(() => abandoned.transitionTo(ExpenseStatusValue.PAYING)).toThrow(
        "Invalid transition: ABANDONED → PAYING",
      );
    });

    it("ABANDONED → PAID should throw", () => {
      const abandoned = ExpenseStatus.fromString("ABANDONED");
      expect(() => abandoned.transitionTo(ExpenseStatusValue.PAID)).toThrow(
        "Invalid transition: ABANDONED → PAID",
      );
    });

    it("PAYING → PAYING should throw — self-transition is invalid", () => {
      // Re-paying something already being paid makes no sense
      expect(() =>
        ExpenseStatus.paying().transitionTo(ExpenseStatusValue.PAYING),
      ).toThrow("Invalid transition: PAYING → PAYING");
    });

    it("PAID → PAID should throw — terminal state does not transition", () => {
      const paid = ExpenseStatus.fromString("PAID");
      expect(() => paid.transitionTo(ExpenseStatusValue.PAID)).toThrow(
        "Invalid transition: PAID → PAID",
      );
    });

    it("ABANDONED → ABANDONED should throw — terminal state does not transition", () => {
      const abandoned = ExpenseStatus.fromString("ABANDONED");
      expect(() =>
        abandoned.transitionTo(ExpenseStatusValue.ABANDONED),
      ).toThrow("Invalid transition: ABANDONED → ABANDONED");
    });
  });

  describe("equals()", () => {
    it("should return true for the same status", () => {
      expect(ExpenseStatus.paying().equals(ExpenseStatus.paying())).toBe(true);
    });

    it("should return false for different statuses", () => {
      const paying = ExpenseStatus.paying();
      const paid = ExpenseStatus.fromString("PAID");
      expect(paying.equals(paid)).toBe(false);
    });
  });

  describe("full business flows", () => {
    it("happy path: PAYING → PAID", () => {
      const status = ExpenseStatus.paying().transitionTo(
        ExpenseStatusValue.PAID,
      );
      expect(status.isPaid()).toBe(true);
    });

    it("abandonment flow: PAYING → ABANDONED", () => {
      const status = ExpenseStatus.paying().transitionTo(
        ExpenseStatusValue.ABANDONED,
      );
      expect(status.isAbandoned()).toBe(true);
    });

    it("after PAID no transition should be possible", () => {
      const paid = ExpenseStatus.paying().transitionTo(ExpenseStatusValue.PAID);

      const allStatuses = Object.values(ExpenseStatusValue);
      allStatuses.forEach((next) => {
        expect(() => paid.transitionTo(next)).toThrow("Invalid transition");
      });
    });

    it("after ABANDONED no transition should be possible", () => {
      const abandoned = ExpenseStatus.paying().transitionTo(
        ExpenseStatusValue.ABANDONED,
      );

      const allStatuses = Object.values(ExpenseStatusValue);
      allStatuses.forEach((next) => {
        expect(() => abandoned.transitionTo(next)).toThrow(
          "Invalid transition",
        );
      });
    });
  });
});
