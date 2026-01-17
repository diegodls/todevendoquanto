import { InstallmentInfo } from "@/core/entities/expense/value-objects/installment-info";
import { describe, expect, it } from "vitest";

describe("INSTALLMENT-INFO", () => {
  describe("create", () => {
    it("should create InstallmentInfo with minimum valid values", () => {
      const current = 1;
      const total = 1;

      const info = InstallmentInfo.create(current, total);

      expect(info.current).toBe(current);
      expect(info.total).toBe(total);
    });

    it("should create InstallmentInfo with maximum valid values", () => {
      const current = 1;
      const total = 120;

      const info = InstallmentInfo.create(current, total);

      expect(info.current).toBe(current);
      expect(info.total).toBe(total);
    });

    it("should create InstallmentInfo with valid different values", () => {
      const current = 1;
      const total = 12;

      const info = InstallmentInfo.create(current, total);

      expect(info.current).toBe(current);
      expect(info.total).toBe(total);
    });

    it("should create InstallmentInfo with any valid values", () => {
      const current = 5;
      const total = 7;

      const info = InstallmentInfo.create(current, total);

      expect(info.current).toBe(current);
      expect(info.total).toBe(total);
    });

    it("should create InstallmentInfo with any last valid values", () => {
      const current = 5;
      const total = 5;

      const info = InstallmentInfo.create(current, total);

      expect(info).toBe(info);
    });
  });

  describe("single", () => {
    it("should create single installment", () => {
      const single = InstallmentInfo.single();

      expect(single.current).toBe(1);
      expect(single.total).toBe(1);
    });

    it("should identify as single installment", () => {
      const single = InstallmentInfo.single();

      expect(single.isSingle()).toBe(true);
    });

    it("should mark single installment as complete", () => {
      const single = InstallmentInfo.single();

      expect(single.isComplete()).toBe(true);
    });
  });

  describe("isComplete", () => {
    it("should return true when current equals total", () => {
      const current = 5;
      const total = 5;
      const info = InstallmentInfo.create(current, total);

      expect(info.isComplete()).toBe(true);
    });

    it("should return false when current is less than total", () => {
      const current = 5;
      const total = 12;
      const info = InstallmentInfo.create(current, total);

      expect(info.isComplete()).toBe(false);
    });

    it("should return false for first installment", () => {
      const current = 1;
      const total = 12;
      const info = InstallmentInfo.create(current, total);

      expect(info.isComplete()).toBe(false);
    });

    it("should return false for first installment", () => {
      const info = InstallmentInfo.single();

      expect(info.isComplete()).toBe(true);
    });
  });

  describe("isSingle", () => {
    it("should return true when total is 1", () => {
      const info = InstallmentInfo.create(1, 1);

      expect(info.isSingle()).toBe(true);
    });

    it("should return false when total is greater tha 1", () => {
      const info = InstallmentInfo.create(1, 12);

      expect(info.isSingle()).toBe(false);
    });

    it("should return true for a single factory method", () => {
      const info = InstallmentInfo.single();
      expect(info.isSingle()).toBe(true);
    });
  });

  describe("next", () => {
    it("should advance to next installment", () => {
      const current = 1;
      const total = 12;
      const info = InstallmentInfo.create(current, total);

      const next = info.next();

      expect(next.current).toBe(current + 1);
      expect(next.total).toBe(12);
    });

    it("should preserve total when advancing to next installment", () => {
      const current = 5;
      const total = 12;
      const info = InstallmentInfo.create(current, total);

      const next = info.next();

      expect(next.current).toBe(current + 1);
      expect(next.total).toBe(12);
    });

    it("should create new instance when advancing", () => {
      const current = 1;
      const total = 12;
      const info = InstallmentInfo.create(current, total);

      const next = info.next();

      expect(info.current).toBe(1);
      expect(info.total).toBe(12);

      expect(next.current).toBe(current + 1);
      expect(next.total).toBe(12);

      expect(info).not.toBe(next);
    });

    it("should advance from penultimate to last", () => {
      const current = 11;
      const total = 12;
      const info = InstallmentInfo.create(current, total);
      const next = info.next();

      expect(next.current).toBe(current + 1);
      expect(next.isComplete()).toBe(true);
    });

    it("should throw a error when advancing from single installment", () => {
      const info = InstallmentInfo.single();

      expect(() => info.next()).toThrow(
        "Cannot advance beyond final installment"
      );
    });

    it("should throw a error when advancing from final installment", () => {
      const current = 12;
      const total = 12;
      const info = InstallmentInfo.create(current, total);
      expect(() => info.next()).toThrow(
        "Cannot advance beyond final installment"
      );
    });
  });

  describe("equals", () => {
    it("should return true for same values", () => {
      const current = 1;
      const total = 12;
      const info1 = InstallmentInfo.create(current, total);
      const info2 = InstallmentInfo.create(current, total);

      expect(info1.equals(info2)).toBe(true);
    });

    it("should return false for different current", () => {
      const current = 1;
      const total = 12;
      const info1 = InstallmentInfo.create(current, total);
      const info2 = InstallmentInfo.create(current + 1, total);

      expect(info1.equals(info2)).toBe(false);
    });

    it("should return false for different total", () => {
      const current = 1;
      const total = 12;
      const info1 = InstallmentInfo.create(current, total);
      const info2 = InstallmentInfo.create(current, total + 1);

      expect(info1.equals(info2)).toBe(false);
    });

    it("should return false when comparing with null", () => {
      const current = 1;
      const total = 12;
      const info1 = InstallmentInfo.create(current, total);

      expect(info1.equals(null as any)).toBe(false);
    });

    it("should return false when comparing with undefined", () => {
      const current = 1;
      const total = 12;
      const info1 = InstallmentInfo.create(current, total);

      expect(info1.equals(undefined as any)).toBe(false);
    });

    it("should return false when comparing with plain object", () => {
      const current = 1;
      const total = 12;
      const info1 = InstallmentInfo.create(current, total);
      const plain = { _current: current, _total: total };

      expect(info1.equals(plain as any)).toBe(false);
    });

    it("should return false for different total", () => {
      const info1 = InstallmentInfo.single();
      const info2 = InstallmentInfo.single();

      expect(info1.equals(info2)).toBe(true);
    });
  });

  describe("toString", () => {
    it("should format as current/total", () => {
      const current = 1;
      const total = 12;
      const info = InstallmentInfo.create(current, total);

      expect(info.toString()).toBe(`${current}/${total}`);
    });

    it("should format single as current/total", () => {
      const info = InstallmentInfo.single();

      expect(info.toString()).toBe("1/1");
    });

    it("should format las installment as current/total", () => {
      const current = 12;
      const total = 12;
      const info = InstallmentInfo.create(current, total);

      expect(info.toString()).toBe(`${current}/${total}`);
    });
  });

  describe("immutability", () => {
    it("should not modify original when calling next", () => {
      const current = 1;
      const total = 12;
      const original = InstallmentInfo.create(current, total);
      const next = original.next();

      expect(original.current).toBe(current);
      expect(next.current).toBe(current + 1);
    });

    it("should create independent instances", () => {
      const current = 1;
      const total = 12;
      const info1 = InstallmentInfo.create(current, total);
      const info2 = InstallmentInfo.create(current + 1, total);

      expect(info1.current).toBe(current);
      expect(info2.current).toBe(current + 1);
    });
  });

  describe("validation errors", () => {
    it("should throw error when current is not integer", () => {
      const current = 1.5;
      const total = 12;
      expect(() => InstallmentInfo.create(current, total)).toThrow(
        "Installment numbers must be integers"
      );
    });

    it("should throw error when current is not integer", () => {
      const current = 1;
      const total = 12.5;
      expect(() => InstallmentInfo.create(current, total)).toThrow(
        "Installment numbers must be integers"
      );
    });

    it("should throw error when current is zero", () => {
      const current = 0;
      const total = 5;
      expect(() => InstallmentInfo.create(current, total)).toThrow(
        "Installment numbers must be positive"
      );
    });

    it("should throw error when total is zero", () => {
      const current = 5;
      const total = 0;
      expect(() => InstallmentInfo.create(current, total)).toThrow(
        "Installment numbers must be positive"
      );
    });

    it("should throw error when current is negative", () => {
      const current = -1;
      const total = 5;
      expect(() => InstallmentInfo.create(current, total)).toThrow(
        "Installment numbers must be positive"
      );
    });

    it("should throw error when total is negative", () => {
      const current = 5;
      const total = -1;
      expect(() => InstallmentInfo.create(current, total)).toThrow(
        "Installment numbers must be positive"
      );
    });

    it("should throw error when total exceeds current", () => {
      const current = 5;
      const total = 2;
      expect(() => InstallmentInfo.create(current, total)).toThrow(
        `Current installment (${current}) cannot exceed total(${total})`
      );
    });

    it("should throw error when total exceeds maximum", () => {
      const current = 5;
      const total = 121;
      expect(() => InstallmentInfo.create(current, total)).toThrow(
        "Total installment cannot exceed 120 months"
      );
    });

    it("should throw error when current is not a number (NaN)", () => {
      const current = NaN;
      const total = 5;
      expect(() => InstallmentInfo.create(current, total)).toThrow(
        "Installment numbers must be integers"
      );
    });

    it("should throw error when total is infinity", () => {
      const current = 1;
      const total = Infinity;
      expect(() => InstallmentInfo.create(current, total)).toThrow(
        "Installment numbers must be integers"
      );
    });
  });
});
