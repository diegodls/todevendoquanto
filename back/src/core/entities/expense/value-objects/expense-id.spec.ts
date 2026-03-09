// core/entities/user/value-objects/user-id.spec.ts

import { describe, expect, it } from "vitest"; // ou jest
import { ExpenseId } from "./expense-id";

describe("UserId", () => {
  describe("create", () => {
    it("should create a new UserId with valid UUID v4", () => {
      const userId = ExpenseId.create();

      const uuidV4Regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(userId).toBeInstanceOf(ExpenseId);
      expect(userId.toString()).toMatch(uuidV4Regex);
    });

    it("should create unique UUIDs on each call", () => {
      const userId1 = ExpenseId.create();
      const userId2 = ExpenseId.create();

      expect(userId1.toString()).not.toBe(userId2.toString());
      expect(userId1.equals(userId2)).toBe(false);
    });
  });

  describe("from", () => {
    it("should create UserId from valid UUID v4 string", () => {
      const validUuid = "550e8400-e29b-41d4-a716-446655440000";

      const userId = ExpenseId.from(validUuid);

      expect(userId).toBeInstanceOf(ExpenseId);
      expect(userId.toString()).toBe(validUuid);
    });

    it("should throw error when id is empty string", () => {
      expect(() => ExpenseId.from("")).toThrow("Expense id cannot be empty");
    });

    it("should throw error when id is whitespace only", () => {
      expect(() => ExpenseId.from("   ")).toThrow("Expense id cannot be empty");
    });

    it("should throw error when id is not a valid UUID v4", () => {
      const invalidIds = [
        "invalid-uuid",
        "123",
        "550e8400-e29b-41d4-a716",
        "550e8400-e29b-31d4-a716-446655440000", // UUID v3, not v4
        "550e8400-e29b-51d4-a716-446655440000", // UUID v5, not v4
        "g50e8400-e29b-41d4-a716-446655440000", // invalid character
      ];

      invalidIds.forEach((invalidId) => {
        expect(() => ExpenseId.from(invalidId)).toThrow(
          "Expense id must be a valid UUID v4",
        );
      });
    });

    it("should accept UUID v4 in uppercase", () => {
      const validUuid = "550E8400-E29B-41D4-A716-446655440000";

      const userId = ExpenseId.from(validUuid);

      expect(userId.toString()).toBe(validUuid);
    });

    it("should accept UUID v4 in lowercase", () => {
      const validUuid = "550e8400-e29b-41d4-a716-446655440000";

      const userId = ExpenseId.from(validUuid);

      expect(userId.toString()).toBe(validUuid);
    });
  });

  describe("toString", () => {
    it("should return the UUID string representation", () => {
      const uuidString = "550e8400-e29b-41d4-a716-446655440000";
      const userId = ExpenseId.from(uuidString);

      expect(userId.toString()).toBe(uuidString);
    });

    it("should return same string on multiple calls", () => {
      const userId = ExpenseId.create();
      const firstCall = userId.toString();
      const secondCall = userId.toString();

      expect(firstCall).toBe(secondCall);
    });
  });

  describe("equals", () => {
    it("should return true when comparing same UUID values", () => {
      const uuidString = "550e8400-e29b-41d4-a716-446655440000";
      const userId1 = ExpenseId.from(uuidString);
      const userId2 = ExpenseId.from(uuidString);

      expect(userId1.equals(userId2)).toBe(true);
    });

    it("should return false when comparing different UUID values", () => {
      const userId1 = ExpenseId.from("550e8400-e29b-41d4-a716-446655440000");
      const userId2 = ExpenseId.from("660e8400-e29b-41d4-a716-446655440000");

      expect(userId1.equals(userId2)).toBe(false);
    });

    it("should return false when comparing with null", () => {
      const userId = ExpenseId.create();

      expect(userId.equals(null as any)).toBe(false);
    });

    it("should return false when comparing with undefined", () => {
      const userId = ExpenseId.create();

      expect(userId.equals(undefined as any)).toBe(false);
    });

    it("should be reflexive (a.equals(a) === true)", () => {
      const userId = ExpenseId.create();

      expect(userId.equals(userId)).toBe(true);
    });

    it("should be symmetric (a.equals(b) === b.equals(a))", () => {
      const uuidString = "550e8400-e29b-41d4-a716-446655440000";
      const userId1 = ExpenseId.from(uuidString);
      const userId2 = ExpenseId.from(uuidString);

      expect(userId1.equals(userId2)).toBe(userId2.equals(userId1));
    });

    it("should be transitive (if a.equals(b) and b.equals(c), then a.equals(c))", () => {
      const uuidString = "550e8400-e29b-41d4-a716-446655440000";
      const userId1 = ExpenseId.from(uuidString);
      const userId2 = ExpenseId.from(uuidString);
      const userId3 = ExpenseId.from(uuidString);

      expect(userId1.equals(userId2)).toBe(true);
      expect(userId2.equals(userId3)).toBe(true);
      expect(userId1.equals(userId3)).toBe(true);
    });
  });

  describe("immutability", () => {
    it("should maintain same value after multiple operations", () => {
      const uuidString = "550e8400-e29b-41d4-a716-446655440000";
      const userId = ExpenseId.from(uuidString);

      userId.toString();
      userId.equals(ExpenseId.create());
      userId.toString();

      expect(userId.toString()).toBe(uuidString);
    });
  });
});
