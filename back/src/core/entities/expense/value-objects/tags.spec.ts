import { Tag } from "@/core/entities/expense/value-objects/tag";
import { Tags } from "@/core/entities/expense/value-objects/tags";
import { describe, expect, it } from "vitest";

describe("Tags", () => {
  describe("create", () => {
    it("should create tags from string array", () => {
      const tags = Tags.create(["nodejs", "react", "typescript"]);

      expect(tags.value).toEqual(["nodejs", "react", "typescript"]);
    });

    it("should remove duplicate tags", () => {
      const tags = Tags.create(["nodejs", "nodejs", "react"]);

      expect(tags.value).toEqual(["nodejs", "react"]);
    });

    it("should normalize tags", () => {
      const tags = Tags.create(["NodeJS", "React"]);

      expect(tags.value).toEqual(["nodejs", "react"]);
    });

    it("should create empty tags when no input", () => {
      const tags = Tags.create();

      expect(tags.isEmpty()).toBe(true);
      expect(tags.value).toEqual([]);
    });

    it("should create empty tags from empty array", () => {
      const tags = Tags.create([]);

      expect(tags.isEmpty()).toBe(true);
    });

    it("should handle tags with spaces", () => {
      const tags = Tags.create(["web development", "full stack"]);

      expect(tags.value).toEqual(["web-development", "full-stack"]);
    });

    it("should remove duplicates after normalization", () => {
      const tags = Tags.create(["NodeJS", "nodejs", "NODEJS"]);

      expect(tags.value).toEqual(["nodejs"]);
      expect(tags.size()).toBe(1);
    });
  });

  describe("empty", () => {
    it("should create empty tags", () => {
      const tags = Tags.empty();

      expect(tags.isEmpty()).toBe(true);
      expect(tags.size()).toBe(0);
    });
  });

  describe("fromTags", () => {
    it("should create from Tag objects", () => {
      const tag1 = Tag.create("nodejs");
      const tag2 = Tag.create("react");

      const tags = Tags.fromTags([tag1, tag2]);

      expect(tags.value).toEqual(["nodejs", "react"]);
    });

    it("should remove duplicates from Tag objects", () => {
      const tag1 = Tag.create("nodejs");
      const tag2 = Tag.create("nodejs");

      const tags = Tags.fromTags([tag1, tag2]);

      expect(tags.size()).toBe(1);
    });
  });

  describe("validation errors", () => {
    it("should throw error when exceeding max tags", () => {
      const manyTags = Array.from({ length: 11 }, (_, i) => `tag-${i}`);

      expect(() => Tags.create(manyTags)).toThrow(
        "Maximum of 10 tags exceeded",
      );
    });

    it("should accept exactly 10 tags", () => {
      const tenTags = Array.from({ length: 10 }, (_, i) => `tag-${i}`);

      const tags = Tags.create(tenTags);

      expect(tags.size()).toBe(10);
    });
  });

  describe("add", () => {
    it("should add tag to empty tags", () => {
      const tags = Tags.empty();
      const updated = tags.add("nodejs");

      expect(updated.value).toEqual(["nodejs"]);
    });

    it("should add tag to existing tags", () => {
      const tags = Tags.create(["nodejs"]);
      const updated = tags.add("react");

      expect(updated.value).toEqual(["nodejs", "react"]);
    });

    it("should not modify original tags (immutability)", () => {
      const tags = Tags.create(["nodejs"]);
      const updated = tags.add("react");

      expect(tags.value).toEqual(["nodejs"]); // Original não muda
      expect(updated.value).toEqual(["nodejs", "react"]);
    });

    it("should not add duplicate tag", () => {
      const tags = Tags.create(["nodejs"]);
      const updated = tags.add("nodejs");

      expect(updated.value).toEqual(["nodejs"]);
      expect(updated).toBe(tags); // Retorna mesmo objeto
    });

    it("should normalize before adding", () => {
      const tags = Tags.create(["nodejs"]);
      const updated = tags.add("NodeJS");

      expect(updated.value).toEqual(["nodejs"]);
      expect(updated).toBe(tags); // Duplicata normalizada
    });

    it("should add Tag object", () => {
      const tags = Tags.create(["nodejs"]);
      const tag = Tag.create("react");
      const updated = tags.add(tag);

      expect(updated.value).toEqual(["nodejs", "react"]);
    });

    it("should throw error when adding to full tags", () => {
      const fullTags = Tags.create(
        Array.from({ length: 10 }, (_, i) => `tag-${i}`),
      );

      expect(() => fullTags.add("extra")).toThrow(
        "Cannot add more than 10 tags",
      );
    });
  });

  describe("remove", () => {
    it("should remove existing tag", () => {
      const tags = Tags.create(["nodejs", "react", "typescript"]);
      const updated = tags.remove("react");

      expect(updated.value).toEqual(["nodejs", "typescript"]);
    });

    it("should not modify original tags (immutability)", () => {
      const tags = Tags.create(["nodejs", "react"]);
      const updated = tags.remove("react");

      expect(tags.value).toEqual(["nodejs", "react"]); // Original não muda
      expect(updated.value).toEqual(["nodejs"]);
    });

    it("should return same object when tag does not exist", () => {
      const tags = Tags.create(["nodejs"]);
      const updated = tags.remove("react");

      expect(updated).toBe(tags);
      expect(updated.value).toEqual(["nodejs"]);
    });

    it("should remove by Tag object", () => {
      const tags = Tags.create(["nodejs", "react"]);
      const tag = Tag.create("react");
      const updated = tags.remove(tag);

      expect(updated.value).toEqual(["nodejs"]);
    });

    it("should normalize before removing", () => {
      const tags = Tags.create(["nodejs", "react"]);
      const updated = tags.remove("React");

      expect(updated.value).toEqual(["nodejs"]);
    });
  });

  describe("has", () => {
    it("should return true when tag exists", () => {
      const tags = Tags.create(["nodejs", "react"]);

      expect(tags.has("nodejs")).toBe(true);
    });

    it("should return false when tag does not exist", () => {
      const tags = Tags.create(["nodejs"]);

      expect(tags.has("react")).toBe(false);
    });

    it("should be case-insensitive", () => {
      const tags = Tags.create(["nodejs"]);

      expect(tags.has("NodeJS")).toBe(true);
    });

    it("should work with Tag object", () => {
      const tags = Tags.create(["nodejs"]);
      const tag = Tag.create("nodejs");

      expect(tags.has(tag)).toBe(true);
    });
  });

  describe("isEmpty", () => {
    it("should return true for empty tags", () => {
      const tags = Tags.empty();

      expect(tags.isEmpty()).toBe(true);
    });

    it("should return false for non-empty tags", () => {
      const tags = Tags.create(["nodejs"]);

      expect(tags.isEmpty()).toBe(false);
    });
  });

  describe("size", () => {
    it("should return 0 for empty tags", () => {
      const tags = Tags.empty();

      expect(tags.size()).toBe(0);
    });

    it("should return correct size", () => {
      const tags = Tags.create(["nodejs", "react", "typescript"]);

      expect(tags.size()).toBe(3);
    });
  });

  describe("equals", () => {
    it("should return true for same tags in same order", () => {
      const tags1 = Tags.create(["nodejs", "react"]);
      const tags2 = Tags.create(["nodejs", "react"]);

      expect(tags1.equals(tags2)).toBe(true);
    });

    it("should return true for same tags in different order", () => {
      const tags1 = Tags.create(["nodejs", "react"]);
      const tags2 = Tags.create(["react", "nodejs"]);

      expect(tags1.equals(tags2)).toBe(true);
    });

    it("should return false for different tags", () => {
      const tags1 = Tags.create(["nodejs"]);
      const tags2 = Tags.create(["react"]);

      expect(tags1.equals(tags2)).toBe(false);
    });

    it("should return false for different sizes", () => {
      const tags1 = Tags.create(["nodejs"]);
      const tags2 = Tags.create(["nodejs", "react"]);

      expect(tags1.equals(tags2)).toBe(false);
    });

    it("should return false when comparing with null", () => {
      const tags = Tags.create(["nodejs"]);

      expect(tags.equals(null as any)).toBe(false);
    });
  });

  describe("toArray", () => {
    it("should return array of tag values", () => {
      const tags = Tags.create(["nodejs", "react"]);

      expect(tags.toArray()).toEqual(["nodejs", "react"]);
    });

    it("should return copy (not modify original)", () => {
      const tags = Tags.create(["nodejs"]);
      const arr = tags.toArray();

      arr.push("react");

      expect(tags.value).toEqual(["nodejs"]); // Original não muda
    });
  });

  describe("toString", () => {
    it("should format as comma-separated list", () => {
      const tags = Tags.create(["nodejs", "react", "typescript"]);

      expect(tags.toString()).toBe("nodejs, react, typescript");
    });

    it("should return empty string for empty tags", () => {
      const tags = Tags.empty();

      expect(tags.toString()).toBe("");
    });
  });

  describe("map", () => {
    it("should map over tags", () => {
      const tags = Tags.create(["nodejs", "react"]);
      const values = tags.map((tag) => tag.value.toUpperCase());

      expect(values).toEqual(["NODEJS", "REACT"]);
    });
  });

  describe("filter", () => {
    it("should filter tags", () => {
      const tags = Tags.create(["nodejs", "angular", "react", "vue"]);
      const filtered = tags.filter((tag) => tag.value.includes("e"));

      expect(filtered.value).toEqual(["nodejs", "react", "vue"]);
    });

    it("should return new Tags instance", () => {
      const tags = Tags.create(["nodejs", "react"]);
      const filtered = tags.filter((tag) => tag.value.length > 5);

      expect(filtered).toBeInstanceOf(Tags);
      expect(filtered.value).toEqual(["nodejs"]);
    });
  });

  describe("forEach", () => {
    it("should iterate over tags", () => {
      const tags = Tags.create(["nodejs", "react"]);
      const values: string[] = [];

      tags.forEach((tag) => values.push(tag.value));

      expect(values).toEqual(["nodejs", "react"]);
    });
  });

  describe("immutability", () => {
    it("should not allow mutation via value getter", () => {
      const tags = Tags.create(["nodejs"]);
      const arr = tags.value;

      arr.push("react");

      expect(tags.value).toEqual(["nodejs"]);
    });

    it("should not allow mutation via tags getter", () => {
      const tags = Tags.create(["nodejs"]);
      const tagArr = tags.tags;
      expect(tags.size()).toBe(1);
    });
  });
});
