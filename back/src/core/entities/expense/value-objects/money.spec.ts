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

  describe("isLessThanOrEq1ual", () => {
    it("should return true when amount is less", () => {
      const money1 = Money.create(50);
      const money2 = Money.create(100);

      expect(money1.isLessThanOrEqual(money2)).toBe(true);
    });

    it("should return true when amounts are equal", () => {
      const money1 = Money.create(50);
      const money2 = Money.create(50);

      expect(money1.isLessThanOrEqual(money2)).toBe(true);
    });

    it("should return true when amounts is greater", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(50);

      expect(money1.isLessThanOrEqual(money2)).toBe(false);
    });
  });

  describe("equals", () => {
    it("should return true for same amount and currency", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(100);

      expect(money1.equals(money2)).toBe(true);
    });

    it("should return false for different amounts", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(50);

      expect(money1.equals(money2)).toBe(false);
    });

    it("should return false for different currencies", () => {
      const usd = Money.create(100, "USD");
      const brl = Money.create(100, "BRL");

      expect(usd.equals(brl)).toBe(false);
    });

    it("should return false when comparing with null", () => {
      const money = Money.create(100);

      expect(money.equals(null as any)).toBe(false);
    });

    it("should return false when comparing with undefined", () => {
      const money = Money.create(100);

      expect(money.equals(undefined as any)).toBe(false);
    });

    it("should return false when comparing with plain object", () => {
      const money = Money.create(100);
      const plain = { _amount: 100, _currency: "BRL" };

      expect(money.equals(plain as any)).toBe(false);
    });
  });

  describe("add", () => {
    it("should add two money amounts", () => {
      const money1 = Money.create(50);
      const money2 = Money.create(50);
      const result = money1.add(money2);

      expect(result.amount).toBe(100);
      expect(result.currency).toBe("BRL");
    });

    it("should add zero", () => {
      const money = Money.create(100);
      const result = money.add(Money.zero());

      expect(result.amount).toBe(100);
    });

    it("should create new instance", () => {
      const money1 = Money.create(100);
      const result = money1.add(Money.zero());

      expect(result.amount).toBe(100);
    });

    it("should create new instance", () => {
      const money = Money.create(50);
      const money2 = Money.create(80);
      const result = money.add(money2);

      expect(money.amount).toBe(50);
      expect(money2.amount).toBe(80);
      expect(result).not.toBe(money);
      expect(result).not.toBe(money2);
    });

    it("should throw error on different currencies", () => {
      const brl = Money.create(100, "BRL");
      const usd = Money.create(100, "USD");

      expect(() => brl.add(usd)).toThrow(
        "Cannot operate on different currencies",
      );
    });

    describe("subtract", () => {
      it("should subtract two money amounts", () => {
        const money1 = Money.create(100);
        const money2 = Money.create(30);
        const result = money1.subtract(money2);

        expect(result.amount).toBe(70);
      });
    });

    it("should subtract to zero", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(100);
      const result = money1.subtract(money2);

      expect(result.amount).toBe(0);

      expect(result.isZero()).toBe(true);
    });

    it("should create a new instance", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(30);
      const result = money1.subtract(money2);

      expect(money1.amount).toBe(100);
      expect(money2.amount).toBe(30);
      expect(result).not.toBe(money1);
    });

    it("should throw error when result would be negative instance", () => {
      const money1 = Money.create(50);
      const money2 = Money.create(100);

      expect(() => money1.subtract(money2)).toThrow(
        "Subtraction would result in negative amount",
      );
    });

    it("should throw error on different currencies", () => {
      const brl = Money.create(100, "BRL");
      const usd = Money.create(100, "USD");

      expect(() => brl.subtract(usd)).toThrow(
        "Cannot operate on different currencies",
      );
    });
  });

  describe("multiply", () => {
    it("should multiply money by factor", () => {
      const money = Money.create(50);
      const result = money.multiply(3);

      expect(result.amount).toBe(150);
      expect(result.currency).toBe("BRL");
    });

    it("should multiply by zero", () => {
      const money = Money.create(100);
      const result = money.multiply(0);

      expect(result.amount).toBe(0);
    });

    it(" multiply by decimal", () => {
      const money = Money.create(100);
      const result = money.multiply(0.5);

      expect(result.amount).toBe(50);
    });

    it("should create new instance", () => {
      const money = Money.create(50);
      const result = money.multiply(2);

      expect(money.amount).toBe(50);
      expect(result).not.toBe(money);
    });

    it("should throw error on NaN factor", () => {
      const money = Money.create(100);

      expect(() => {
        money.multiply(NaN);
      }).toThrow("Multiplication factor must be a finite number");
    });

    it("should throw error on negative factor", () => {
      const money = Money.create(100);

      expect(() => money.multiply(-2)).toThrow(
        "Multiplication factor cannot be negative",
      );
    });
  });
});
