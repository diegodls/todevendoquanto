import { UserName } from "@/core/entities/user/value-objects/user-name";
import { describe, expect, it } from "vitest";

describe("UserName", () => {
  describe("create", () => {
    it("should create with a valid name", () => {
      const validName = "Valid_name";

      const expenseName = UserName.create(validName);

      expect(expenseName.value).toBe(validName);
    });

    it("should trim when create with a valid name", () => {
      const validName = "      name      ";

      const expenseName = UserName.create(validName);

      expect(expenseName.value).toBe("name");
    });

    it("should throw with empty name", () => {
      expect(() => UserName.create("")).toThrow(
        "User name cannot be empty or whitespace",
      );
    });

    it("should throw with only spaces", () => {
      expect(() => UserName.create("                 ")).toThrow(
        "User name cannot be empty or whitespace",
      );
    });

    it("should allow exactly 3 characters", () => {
      const validName = "Val";

      const userName = UserName.create(validName);

      expect(userName.value).toBe(validName);
    });

    it("should allow exactly 20 characters", () => {
      const validName = "v".repeat(20);

      const userName = UserName.create(validName);

      expect(userName.value).toBe(validName);
    });

    it("should throw error when name is only tabs and spaces", () => {
      expect(() => UserName.create("\t  \n  ")).toThrow(
        "User name cannot be empty or whitespace",
      );
    });

    it("should throw if name has less than 3 characters", () => {
      expect(() => UserName.create("Va")).toThrow(
        "User name must have at least 3 characters",
      );
    });

    it("should throw if trimmed name results in less than 3 characters", () => {
      expect(() => UserName.create("   Va   ")).toThrow(
        "User name must have at least 3 characters",
      );
    });
  });
});
