// src/domain/value-objects/Description.test.ts
import { ExpenseDescription } from "@/core/entities/expense/value-objects/expense-description";
import { InvalidDescriptionError } from "@/core/shared/errors/domain/InvalidDescriptionError";
import { describe, expect, it } from "vitest";

describe("Description Value Object", () => {
  it("should create a valid description with normal text", () => {
    const desc = ExpenseDescription.create("This is a valid description");
    expect(desc.toString()).toBe("This is a valid description");
  });

  it("should automatically trim whitespace from ends", () => {
    const desc = ExpenseDescription.create("  Trimmed content  ");
    expect(desc.toString()).toBe("Trimmed content");
    expect(desc.toString().startsWith(" ")).toBe(false);
    expect(desc.toString().endsWith(" ")).toBe(false);
  });

  it("should throw error if description is empty", () => {
    expect(() => ExpenseDescription.create("")).toThrow(
      InvalidDescriptionError,
    );
    expect(() => ExpenseDescription.create("")).toThrow("cannot be empty");
  });

  it("should throw error if description is only whitespace", () => {
    expect(() => ExpenseDescription.create("   ")).toThrow(
      InvalidDescriptionError,
    );
    expect(() => ExpenseDescription.create("\n\t")).toThrow(
      InvalidDescriptionError,
    );
  });

  it("should accept description with exactly minimum length", () => {
    const desc = ExpenseDescription.create("One"); // 3 chars
    expect(desc.toString()).toBe("One");
  });

  it("should throw error if description is too long (more than 500 chars)", () => {
    const longString = "a".repeat(501);
    expect(() => ExpenseDescription.create(longString)).toThrow(
      InvalidDescriptionError,
    );
    expect(() => ExpenseDescription.create(longString)).toThrow(
      "cannot exceed 500",
    );
  });

  it("should accept description with exactly maximum length", () => {
    const maxString = "a".repeat(500);
    const desc = ExpenseDescription.create(maxString);
    expect(desc.toString().length).toBe(500);
  });

  it("should throw error if description contains HTML tags", () => {
    expect(() =>
      ExpenseDescription.create("Safe text <script>alert(1)</script>"),
    ).toThrow(InvalidDescriptionError);
    expect(() => ExpenseDescription.create("Div <div>content</div>")).toThrow(
      InvalidDescriptionError,
    );
  });

  it("should allow special characters but not HTML tags", () => {
    const desc = ExpenseDescription.create(
      "Cost is $100 & taxes are 10% <--- not a tag",
    );
    const safeDesc = ExpenseDescription.create("Cost is $100 & taxes are 10%");
    expect(safeDesc.toString()).toBe("Cost is $100 & taxes are 10%");
  });

  it("should be immutable (value cannot be changed after creation)", () => {
    const desc = ExpenseDescription.create("Initial Value");

    expect(() => {
      // @ts-ignore - for tests
      desc._value = "Hacked";
    }).toThrow();

    expect(desc.toString()).toBe("Initial Value");
  });

  it("should check equality correctly", () => {
    const desc1 = ExpenseDescription.create("Same Text");
    const desc2 = ExpenseDescription.create("Same Text");
    const desc3 = ExpenseDescription.create("Different Text");

    expect(desc1.equals(desc2)).toBe(true);
    expect(desc1.equals(desc3)).toBe(false);
    // @ts-ignore - for tests
    expect(desc1.equals(null)).toBe(false);
  });

  it("should create a new instance for updates (immutable pattern)", () => {
    const desc1 = ExpenseDescription.create("First Value");
    const desc2 = ExpenseDescription.create("Second Value");
    expect(desc1).not.toBe(desc2);
    expect(desc1.toString()).not.toBe(desc2.toString());
  });
});
