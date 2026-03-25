import { Money } from "@/core/entities/expense/value-objects/money";
import { describe, expect, it } from "vitest";

describe("money", () => {
  describe("create", () => {
    it("should create valid money with default currency", () => {
      const money = Money.create(100);
      expect(money.cents).toBe(100);
      expect(money.currency).toBe("BRL");
    });

    it("should create valid money specified currency", () => {
      const money = Money.create(100, "USD");
      expect(money.cents).toBe(100);
      expect(money.currency).toBe("USD");
    });

    it("should accept zero amount", () => {
      const money = Money.create(0);
      expect(money.cents).toBe(0);
    });

    it("should create money from cents amount", () => {
      const money = Money.create(4990);
      expect(money.cents).toBe(4990);
    });

    it("should accept decimal amounts", () => {
      const money = Money.create(49.99);
      expect(money.cents).toBe(4999);
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

    it("should handle single cent", () => {
      const money = Money.create(0.01, "BRL");
      expect(money.cents).toBe(1);
    });
  });

  describe("zero", () => {
    it("should create zero money with default currency", () => {
      const money = Money.zero();

      expect(money.cents).toBe(0);
      expect(money.currency).toBe("BRL");
      expect(money.isZero()).toBe(true);
    });

    it("should create zero money with specified currency", () => {
      const money = Money.zero("USD");

      expect(money.cents).toBe(0);
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

    it("should not throw error when receives non-integer", () => {
      expect(() => {
        Money.create(49.9);
      }).not.toThrow();
    });

    it("should not throw error when receives integer", () => {
      expect(() => {
        Money.create(1);
      }).not.toThrow();
    });
  });

  describe("cents getter", () => {
    it("should return cents for whole amount", () => {
      const money = Money.create(50);

      expect(money.decimal).toBe(0.5);
    });

    it("should return cents for decimal amount", () => {
      const money = Money.create(49.99);

      expect(money.decimal).toBe(49.99);
    });

    it("should return zero cents", () => {
      const money = Money.create(0);

      expect(money.decimal).toBe(0);
    });

    it("should round cents from imprecise decimals", () => {
      const money = Money.create(49.999);

      expect(money.decimal).toBe(49.999);
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

    describe("isLessThanOrEqual", () => {
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
  });

  describe("add", () => {
    it("should add two money amounts", () => {
      const money1 = Money.create(50);
      const money2 = Money.create(50);
      const result = money1.add(money2);

      expect(result.cents).toBe(100);
      expect(result.currency).toBe("BRL");
    });

    it("should add zero", () => {
      const money = Money.create(100);
      const result = money.add(Money.zero());

      expect(result.cents).toBe(100);
    });

    it("should create new instance", () => {
      const money1 = Money.create(100);
      const result = money1.add(Money.zero());

      expect(result.cents).toBe(100);
    });

    it("should create new instance", () => {
      const money = Money.create(50);
      const money2 = Money.create(80);
      const result = money.add(money2);

      expect(money.cents).toBe(50);
      expect(money2.cents).toBe(80);
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
  });

  describe("subtract", () => {
    it("should subtract two money amounts", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(30);
      const result = money1.subtract(money2);

      expect(result.cents).toBe(70);
    });

    it("should subtract to zero", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(100);
      const result = money1.subtract(money2);

      expect(result.cents).toBe(0);

      expect(result.isZero()).toBe(true);
    });

    it("should create a new instance", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(30);
      const result = money1.subtract(money2);

      expect(money1.cents).toBe(100);
      expect(money2.cents).toBe(30);
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

      expect(result.cents).toBe(150);
      expect(result.currency).toBe("BRL");
    });

    it("should multiply by zero", () => {
      const money = Money.create(100);
      const result = money.multiply(0);

      expect(result.cents).toBe(0);
    });

    it("should multiply by decimal", () => {
      const money = Money.create(100);
      const result = money.multiply(0.5);

      expect(result.cents).toBe(50);
    });

    it("should create new instance", () => {
      const money = Money.create(50);
      const result = money.multiply(2);

      expect(money.cents).toBe(50);
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

  describe("divide", () => {
    it("should divide with valid cent number", () => {
      const money = Money.create(100);
      const divided = money.divide(2);
      expect(divided.cents).toBe(50);
      expect(divided.decimal).toBe(0.5);
      expect(divided.currency).toBe("BRL");
    });

    it("should divide with valid decimal number", () => {
      const money = Money.create(50.5);
      const divided = money.divide(2);
      expect(divided.cents).toBe(2525);
      expect(divided.decimal).toBe(25.25);
      expect(divided.currency).toBe("BRL");
    });

    it("should divide with different currency", () => {
      const money = Money.create(100, "USD");
      const divided = money.divide(2);

      expect(divided.cents).toBe(50);
      expect(divided.decimal).toBe(0.5);
      expect(divided.currency).toBe("USD");
    });

    it("should divide by decimal ", () => {
      const money = Money.create(100);
      const divided = money.divide(0.2);
      expect(divided.cents).toBe(500);
      expect(divided.decimal).toBe(5);
    });

    it("should create new instance", () => {
      const money = Money.create(100);
      const divided = money.divide(2);
      expect(money.cents).toBe(100);
      expect(money).not.toBe(divided);
    });

    it("should throw error on Infinity divisor", () => {
      const money = Money.create(100);

      expect(() => money.divide(Infinity)).toThrow(
        "Divisor factor must be a finite number",
      );
    });

    it("should throw when divisor is NaN", () => {
      const money = Money.create(100);

      expect(() => money.divide(NaN)).toThrow(
        "Divisor factor must be a finite number",
      );
    });

    it("should throw when divisor is zero", () => {
      const money = Money.create(100);

      expect(() => money.divide(0)).toThrow("Cannot divide by zero");
    });

    it("should throw when divisor is negative", () => {
      const money = Money.create(100);
      expect(() => money.divide(-1)).toThrow("Divisor cannot be negative");
    });
  });

  describe("allocate", () => {
    it("should allocate money proportionally", () => {
      const money = Money.create(100);
      const result = money.allocate([1, 1, 1]);

      expect(result).toHaveLength(3);
      expect(result[0].cents).toBe(33);
      expect(result[1].cents).toBe(33);
      expect(result[2].cents).toBe(34);
    });

    it("should allocate with different ratios", () => {
      const money = Money.create(100);
      const result = money.allocate([7, 3]);

      expect(result).toHaveLength(2);
      expect(result[0].cents).toBe(70);
      expect(result[1].cents).toBe(30);
    });

    it("should allocate cents without loss", () => {
      const money = Money.create(1000);
      const result = money.allocate([1, 1, 1]);

      const totalCents = result.reduce((sum, m) => sum + m.cents, 0);

      expect(totalCents).toBe(1000);
    });

    it("should handle single allocation", () => {
      const money = Money.create(100);
      const result = money.allocate([1]);

      expect(result).toHaveLength(1);
      expect(result[0].cents).toBe(100);
    });

    it("should preserve currency", () => {
      const money = Money.create(100, "USD");
      const result = money.allocate([1, 1]);

      expect(result[0].currency).toBe("USD");
      expect(result[1].currency).toBe("USD");
    });

    it("should throw error on empty ratios", () => {
      const money = Money.create(100);

      expect(() => money.allocate([])).toThrow("Ratios array cannot be empty");
    });

    it("should throw error on zero total ratio", () => {
      const money = Money.create(100);

      expect(() => money.allocate([0, 0])).toThrow(
        "Total of ratios cannot be zero",
      );
    });

    it("should throw error on negative ratio", () => {
      const money = Money.create(100);

      expect(() => money.allocate([-1, -1])).toThrow(
        "Ratios cannot be negative",
      );
    });
  });

  describe("toString", () => {
    it("should format money as string", () => {
      const money = Money.create(100);
      expect(money.toString()).toBe("BRL 100.00");
    });

    it("should format with two decimal places", () => {
      const money = Money.create(49.9);
      expect(money.toString()).toBe("BRL 4990.00");
    });

    it("should format zero", () => {
      const money = Money.zero();
      expect(money.toString()).toBe("BRL 0.00");
    });

    it("should format different currency", () => {
      const money = Money.create(100, "USD");
      expect(money.toString()).toBe("USD 100.00");
    });
  });

  describe("toJson", () => {
    it("should serialize to JSON", () => {
      const money = Money.create(100, "USD");
      const json = money.toJSON();

      expect(json).toEqual({
        amount: 100,
        currency: "USD",
      });
    });

    it("should be JSON.stringify compatible", () => {
      const money = Money.create(49.99);
      const serialized = JSON.stringify(money);

      expect(serialized).toContain('"amount":4999');
      expect(serialized).toContain('"currency":"BRL"');
    });
  });

  describe("immutability", () => {
    it("should not modify original on add", () => {
      const original = Money.create(100);
      const added = original.add(Money.create(50));

      expect(original.cents).toBe(100);
      expect(added.cents).toBe(150);
    });

    it("should not modify original on subtract", () => {
      const original = Money.create(100);
      const subtracted = original.subtract(Money.create(30));
      expect(original.cents).toBe(100);
      expect(subtracted.cents).toBe(70);
    });

    it("should not modify original on multiply", () => {
      const original = Money.create(100);
      const multiplied = original.multiply(2);

      expect(original.cents).toBe(100);
      expect(multiplied.cents).toBe(200);
    });

    it("should create independent instances", () => {
      const money1 = Money.create(100);
      const money2 = Money.create(200);

      expect(money1.cents).toBe(100);
      expect(money2.cents).toBe(200);

      expect(money1).not.toBe(money2);
    });
  });

  describe("split", () => {
    const currency = "BRL";
    describe("input validation", () => {
      it("should throw error if parts is 0", () => {
        const money = Money.create(100, currency);
        expect(() => money.split(0)).toThrowError(
          "The split quantity must be a integer positive",
        );
      });

      it("should throw error if parts is negative", () => {
        const money = Money.create(100, currency);
        expect(() => money.split(-5)).toThrowError(
          "The split quantity must be a integer positive",
        );
      });

      it("should throw error if parts is a float", () => {
        const money = Money.create(100, currency);
        expect(() => money.split(2.5)).toThrowError(
          "The split quantity must be a integer positive",
        );
      });

      it("should throw error if parts is NaN", () => {
        const money = Money.create(100, currency);
        expect(() => money.split(NaN)).toThrowError(
          "The split quantity must be a integer positive",
        );
      });

      it("should throw error if parts is Infinity", () => {
        const money = Money.create(100, currency);
        expect(() => money.split(Infinity)).toThrowError(
          "The split quantity must be a integer positive",
        );
      });
    });

    describe("exact division", () => {
      it("should split evenly when amount is divisible by parts", () => {
        const money = Money.create(100, currency);

        const parts = money.split(4);

        expect(parts.length).toBe(4);

        parts.forEach((p) => expect(p.cents).toBe(25));

        expect(Money.sum(parts)).toBe(100);
      });

      it("should split evenly when cents is divisible by parts", () => {
        const money = Money.create(1000, currency);

        const parts = money.split(4);

        expect(parts.length).toBe(4);

        parts.forEach((p) => expect(p.cents).toBe(250));

        expect(Money.sum(parts)).toBe(1000);
      });

      it("should return single item equal to original when parts is 1", () => {
        const money = Money.create(50, currency);
        const parts = money.split(1);

        expect(parts.length).toBe(1);
        expect(parts[0].cents).toBe(50);
        expect(parts[0].currency).toBe(currency);
      });
    });

    describe("remainder distribution", () => {
      it("should distribute remainder to the FIRST parts", () => {
        const money = Money.create(10, currency);

        const parts = money.split(3);

        expect(parts.length).toBe(3);

        expect(parts[0].cents).toBe(4);
        expect(parts[1].cents).toBe(3);
        expect(parts[2].cents).toBe(3);

        expect(Money.sum(parts)).toBe(10);

        expect(money.decimal).toBe(0.1);
      });

      it("should handle remainder larger than 1", () => {
        const money = Money.create(10, currency);

        const parts = money.split(4);

        expect(parts.length).toBe(4);

        expect(parts[0].cents).toBe(3);
        expect(parts[1].cents).toBe(3);
        expect(parts[2].cents).toBe(2);
        expect(parts[3].cents).toBe(2);

        expect(Money.sum(parts)).toBe(10);
      });
    });

    describe("edge cases", () => {
      it("should throw when amount is 0", () => {
        const money = Money.create(0, currency);

        expect(() => money.split(5)).toThrow(
          "Is not possible to split 0 in 5 parts",
        );
      });

      it("should throw when base is 0", () => {
        const money = Money.create(5, currency);

        expect(() => money.split(10)).toThrow(
          "Is not possible to split 0.05 in 10 parts",
        );
      });

      it("should handle smallest unit (1) split into 1", () => {
        const money = Money.create(1, currency);
        const parts = money.split(1);

        expect(parts[0].cents).toBe(1);
      });

      it("should throw when smallest unit (1) split into 2", () => {
        const money = Money.create(1, currency);

        expect(() => money.split(2)).toThrow(
          "Is not possible to split 0.01 in 2 parts",
        );
      });
    });

    describe("integrity", () => {
      it("should preserve currency in all split parts", () => {
        const money = Money.create(100, "USD");
        const parts = money.split(3);

        parts.forEach((p) => expect(p.currency).toBe("USD"));
      });

      it("should ensure sum of parts always equals original amount (Property Based)", () => {
        const testCases = [
          { amount: 100, parts: 3 },
          { amount: 100, parts: 7 },
          { amount: 1000, parts: 9 },
          { amount: 500, parts: 100 },
        ];

        testCases.forEach(({ amount, parts }) => {
          const money = Money.create(amount, currency);
          const split = money.split(parts);
          const total = Money.sum(split);

          expect(total).toBe(amount);
          expect(split.length).toBe(parts);
        });
      });
    });
  });
});
