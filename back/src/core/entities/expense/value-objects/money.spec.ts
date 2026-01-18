import { Money } from "@/core/entities/expense/value-objects/money";
import { describe, expect, it } from "vitest";

describe("Money", () => {
  describe("create", () => {
    it("should create valid money with default currency", () => {
      const money = Money.create(100);
      expect(money.amount).toBe(100);
      expect(money.currency).toBe("BRL");
    });

    it("should create valid money specified currency", () => {
      const money = Money.create(100, "USD");
      expect(money.amount).toBe(100);
      expect(money.currency).toBe("USD");
    });
  });

  it("should accept zero amount", () => {
    const money = Money.create(0);
    expect(money.amount).toBe(0);
  });

  it("should accept decimal amounts", () => {
    const money = Money.create(49.99);
    expect(money.amount).toBe(49.99);
  });

  it("should normalize currency to uppercase", () => {
    const moneyBRL = Money.create(100, "brl");
    const moneyUSD = Money.create(100, "usd");
    expect(moneyBRL.currency).toBe("BRL");
    expect(moneyUSD.currency).toBe("USD");
  });

  it("should handle all currency", () => {
    const currencies = ["BRL", "USD"];

    currencies.forEach((currency) => {
      const money = Money.create(100, currency);
      expect(money.currency).toBe(currency);
    });
  });

  describe("fromCents", () => {
    it("should create money from  cents", () => {
      const money = Money.fromCents(4990);

      expect(money.amount).toBe(49.9);
      expect(money.cents).toBe(4990);
    });

    it("should create money from zero cents", () => {
      const money = Money.fromCents(0);

      expect(money.amount).toBe(0);
      expect(money.cents).toBe(0);
    });

    it("should create money with specified currency", () => {
      const money = Money.fromCents(10000, "USD");
      expect(money.amount).toBe(100);
      expect(money.currency).toBe("USD");
    });

    it("should handle single cent", () => {
      const money = Money.fromCents(1, "BRL");
      expect(money.amount).toBe(0.01);
    });

    it("should normalize currency to uppercase", () => {
      const money = Money.fromCents(10, "brl");

      expect(money.currency).toBe("BRL");
    });
  });

  describe("zero", () => {
    it("should create zero money with default currency", () => {
      const money = Money.zero();

      expect(money.amount).toBe(0);
      expect(money.currency).toBe("BRL");
      expect(money.isZero()).toBe(true);
    });

    it("should create zero money with specified currency", () => {
      const money = Money.zero("USD");

      expect(money.amount).toBe(0);
      expect(money.currency).toBe("USD");
    });
  });

  describe("validation errors", () => {
    it("should throw error on negative amount", () => {
      expect(() => Money.create(-1)).toThrow("Money amount cannot be negative");
    });

    it("should throw error on NaN amount", () => {
      expect(() => Money.create(NaN)).toThrow(
        "Money amount must be a valid number",
      );
    });

    it("should throw error on Infinity amount", () => {
      expect(() => Money.create(Infinity)).toThrow(
        "Money amount must be a valid number",
      );
    });

    it("should not throw error on empty currency", () => {
      expect(() => Money.create(100, "")).not.toThrow(
        "Currency cannot be empty",
      );
    });

    it("should throw error on numeric currency", () => {
      expect(() => {
        Money.create(100, "123");
      }).toThrow("Invalid currency: 123");
    });

    it("should throw error when fromCents receives non-integer", () => {
      expect(() => {
        Money.fromCents(49.9);
      }).toThrow("Cents must be a integer");
    });
  });

  describe("cents getter", () => {
    it("should return cents for whole amount", () => {
      const money = Money.create(50);

      expect(money.cents).toBe(5000);
    });

    it("should return cents for decimal amount", () => {
      const money = Money.create(49.99);

      expect(money.cents).toBe(4999);
    });

    it("should return zero cents", () => {
      const money = Money.create(0);

      expect(money.cents).toBe(0);
    });

    it("should round cents from imprecise decimals", () => {
      const money = Money.create(49.999);

      expect(money.cents).toBe(5000);
    });
  });

  describe("isZero", () => {
    it("should return true for zero amount", () => {
      const money = Money.create(0);
      expect(money.isZero()).toBe(true);
    });

    it("should return false for positive amount", () => {
      const money = Money.create(0.01);

      expect(money.isZero()).toBe(false);
    });

    it("should return true for zero factory", () => {
      const money = Money.zero();

      expect(money.isZero()).toBe(true);
    });
  });
  describe("comparisons", () => {
    describe("isGreaterThan", () => {
      it("should return true when amount is greater", () => {
        const money1 = Money.create(100);
        const money2 = Money.create(20);

        expect(money1.isGreaterThan(money2)).toBe(true);
      });
    });

    it("should return false when amount is less", () => {
      const money1 = Money.create(50);
      const money2 = Money.create(100);

      expect(money1.isGreaterThan(money2)).toBe(false);
    });

    it("should return false when amount are equal", () => {
      const money1 = Money.create(75);
      const money2 = Money.create(75);

      expect(money1.isGreaterThan(money2)).toBe(false);
    });

    it("should throw error on different currencies", () => {
      const brl = Money.create(99, "BRL");
      const usd = Money.create(99, "USD");

      expect(() => brl.isGreaterThan(usd)).toThrow(
        "Cannot operate on different currencies",
      );
    });
  });

  describe("isGreaterThanOrEqual", () => {
    it("should return true when amount is greater", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(50);
      expect(money1.isGreaterThanOrEqual(money2)).toBe(true);
    });

    it("should return true when amounts are equals", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(100);
      expect(money1.isGreaterThanOrEqual(money2)).toBe(true);
    });

    it("should return false when amount is less", () => {
      const money1 = Money.create(50);
      const money2 = Money.create(100);
      expect(money1.isGreaterThanOrEqual(money2)).toBe(false);
    });
  });
  describe("isLessThan", () => {
    it("should return true when amount is less", () => {
      const money1 = Money.create(50);
      const money2 = Money.create(100);
      expect(money1.isLessThan(money2)).toBe(true);
    });

    it("should return false when amount is greater", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(50);
      expect(money1.isLessThan(money2)).toBe(false);
    });

    it("should return false when amount are equal", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(100);
      expect(money1.isLessThan(money2)).toBe(false);
    });
  });
});
