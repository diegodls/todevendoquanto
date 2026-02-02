import { describe, expect, it } from "vitest";
import { Tag } from "./tag";

// ============= Tag.spec.ts =============
describe("Tag", () => {
  describe("create", () => {
    it("should create valid tag", () => {
      const tag = Tag.create("nodejs");

      expect(tag.value).toBe("nodejs");
    });

    it("should normalize to lowercase", () => {
      const tag = Tag.create("NodeJS");

      expect(tag.value).toBe("nodejs");
    });

    it("should trim whitespace", () => {
      const tag = Tag.create("  react  ");

      expect(tag.value).toBe("react");
    });

    it("should replace spaces with hyphens", () => {
      const tag = Tag.create("web development");

      expect(tag.value).toBe("web-development");
    });

    it("should replace multiple spaces with single hyphen", () => {
      const tag = Tag.create("full   stack");

      expect(tag.value).toBe("full-stack");
    });

    it("should accept numbers", () => {
      const tag = Tag.create("web3");

      expect(tag.value).toBe("web3");
    });

    it("should accept hyphens", () => {
      const tag = Tag.create("front-end");

      expect(tag.value).toBe("front-end");
    });

    it("should handle tag with exactly 3 characters", () => {
      const tag = Tag.create("vue");

      expect(tag.value).toBe("vue");
    });

    it("should handle tag with exactly 10 characters", () => {
      const tag = Tag.create("a".repeat(10));

      expect(tag.value).toBe("a".repeat(10));
    });
  });

  describe("validation errors", () => {
    it("should throw error on empty string", () => {
      expect(() => Tag.create("")).toThrow("Tag cannot be empty or whitespace");
    });

    it("should throw error on whitespace only", () => {
      expect(() => Tag.create("   ")).toThrow(
        "Tag cannot be empty or whitespace",
      );
    });

    it("should throw error on tag too short", () => {
      expect(() => Tag.create("ab")).toThrow(
        "Tag must have at least 3 characters",
      );
    });

    it("should throw error on tag too long", () => {
      const longTag = "a".repeat(21);
      expect(() => Tag.create(longTag)).toThrow(
        "Tag cannot exceed 20 characters",
      );
    });

    it("should throw error on uppercase letters", () => {
      expect(() => Tag.create("NodeJS")).not.toThrow(); // Normaliza
      expect(Tag.create("NodeJS").value).toBe("nodejs");
    });

    it("should throw error on special characters", () => {
      expect(() => Tag.create("tag@#$")).toThrow(
        "Tag can only contain lowercase letters",
      );
    });

    it("should throw error on underscore", () => {
      expect(() => Tag.create("web_dev")).toThrow(
        "Tag can only contain lowercase letters",
      );
    });

    it("should throw error on dot", () => {
      expect(() => Tag.create("node.js")).toThrow(
        "Tag can only contain lowercase letters",
      );
    });
  });

  describe("equals", () => {
    it("should return true for same value", () => {
      const tag1 = Tag.create("nodejs");
      const tag2 = Tag.create("nodejs");

      expect(tag1.equals(tag2)).toBe(true);
    });

    it("should return true for same value with different case", () => {
      const tag1 = Tag.create("nodejs");
      const tag2 = Tag.create("NodeJS");

      expect(tag1.equals(tag2)).toBe(true);
    });

    it("should return false for different values", () => {
      const tag1 = Tag.create("nodejs");
      const tag2 = Tag.create("react");

      expect(tag1.equals(tag2)).toBe(false);
    });

    it("should return false when comparing with null", () => {
      const tag = Tag.create("nodejs");

      expect(tag.equals(null as any)).toBe(false);
    });

    it("should return false when comparing with non-Tag", () => {
      const tag = Tag.create("nodejs");

      expect(tag.equals({ value: "nodejs" } as any)).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return tag value as string", () => {
      const tag = Tag.create("nodejs");

      expect(tag.toString()).toBe("nodejs");
    });
  });
});
