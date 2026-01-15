import { ExpenseName } from "@/core/entities/expense/value-objects/expense-name";
import { describe, expect, it } from "vitest";

describe("ExpenseName", () => {
  describe("create", () => {
    it("should create a valid ExpenseName", () => {
      const expenseName = ExpenseName.create("valid_name");

      expect(expenseName.value).toBe("valid_name");
    });

    it("should trim whitespace from both ends", () => {
      const expenseName = ExpenseName.create("       valid_name         ");
      expect(expenseName.value).toBe("valid_name");
    });

    it("should allow exactly 3 characters (lower boundary)", () => {
      const expenseName = ExpenseName.create("Val");
      expect(expenseName.value).toBe("Val");
    });

    it("should allow exactly 100 characters (upper boundary)", () => {
      const longName = "v".repeat(100);
      const expenseName = ExpenseName.create(longName);
      expect(expenseName.value).toBe(longName);
    });

    it("should throw if name is empty", () => {
      expect(() => ExpenseName.create("")).toThrow(
        "Expense name cannot be empty or whitespace"
      );
    });

    it("should throw if name is only whitespace", () => {
      expect(() => ExpenseName.create("         ")).toThrow(
        "Expense name cannot be empty or whitespace"
      );
    });

    it("should throw error when name is only tabs and spaces", () => {
      expect(() => ExpenseName.create("\t  \n  ")).toThrow(
        "Expense name cannot be empty or whitespace"
      );
    });

    it("should throw if name has less than 3 characters", () => {
      expect(() => ExpenseName.create("Va")).toThrow(
        "Expense name must have at least 3 characters"
      );
    });

    it("should throw if trimmed name results in less tha 3 characters", () => {
      expect(() => ExpenseName.create("   Va   ")).toThrow(
        "Expense name must have at least 3 characters"
      );
    });

    it("should throw if name exceeds 100 characters", () => {
      const longName = "v".repeat(101);

      expect(() => ExpenseName.create(longName)).toThrow(
        "Expense name cannot exceed 100 characters"
      );
    });
  });

  describe("equals", () => {
    it("should be equal to another ExpenseName with the same value", () => {
      const name1 = ExpenseName.create("valid_name");
      const name2 = ExpenseName.create("valid_name");

      expect(name1.equals(name2)).toBe(true);
    });

    it("should be equal even if created with whitespace (due to trim)", () => {
      const name1 = ExpenseName.create("valid_name");
      const name2 = ExpenseName.create("   valid_name   ");

      expect(name1.equals(name2)).toBe(true);
    });

    it("should not be equal to an ExpenseName with different value", () => {
      const name1 = ExpenseName.create("valid_name");
      const name2 = ExpenseName.create("name_valid");

      expect(name1.equals(name2)).toBe(false);
    });

    it("should return false if comparing against a non-ExpenseName object", () => {
      const name = ExpenseName.create("valid_name");
      const noAnExpenseName = { _value: "valid_name" } as any;

      expect(name.equals(noAnExpenseName)).toBe(false);
    });
  });

  describe("value getter", () => {
    it("should return the internal value", () => {
      const name = ExpenseName.create("valid_name");
      expect(name.value).toBe("valid_name");
    });

    it("should return the internal value trimmed", () => {
      const name = ExpenseName.create("   valid_name   ");
      expect(name.value).toBe("valid_name");
    });
  });

  describe("immutability", () => {
    it("should not allow modification of internal value", () => {
      const name = ExpenseName.create("valid_name");

      // ! name.value = "invalid_name"; if you try, Typescript will throw a error

      expect(name.value).toBe("valid_name");
    });

    it("should create independent instances", () => {
      const name1 = ExpenseName.create("valid_name");
      const name2 = ExpenseName.create("name_valid");

      expect(name1.value).toBe("valid_name");
      expect(name2.value).toBe("name_valid");

      expect(name1.equals(name2)).toBe(false);
    });
  });
});
