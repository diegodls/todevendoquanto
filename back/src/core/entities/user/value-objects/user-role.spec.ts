import { describe, expect, it } from "vitest";
import { UserRole } from "./user-role";

describe("UserRole", () => {
  describe("create", () => {
    it("should create BASIC role", () => {
      const role = UserRole.create("BASIC");

      expect(role).toBeInstanceOf(UserRole);
      expect(role.toString()).toBe("BASIC");
    });

    it("should create ADMIN role", () => {
      const role = UserRole.create("ADMIN");

      expect(role).toBeInstanceOf(UserRole);
      expect(role.toString()).toBe("ADMIN");
    });

    it("should normalize role to uppercase", () => {
      const roles = ["basic", "admin", "BaSiC", "AdMiN", "BASIC", "ADMIN"];

      roles.forEach((roleStr) => {
        const role = UserRole.create(roleStr);
        expect(role.toString()).toBe(roleStr.toUpperCase());
      });
    });

    it("should trim whitespace from role", () => {
      const role1 = UserRole.create("  BASIC  ");
      const role2 = UserRole.create("  ADMIN  ");

      expect(role1.toString()).toBe("BASIC");
      expect(role2.toString()).toBe("ADMIN");
    });

    it("should normalize and trim together", () => {
      const role = UserRole.create("  basic  ");

      expect(role.toString()).toBe("BASIC");
    });

    it("should throw error when role is empty string", () => {
      expect(() => UserRole.create("")).toThrow("Role cannot be empty");
    });

    it("should throw error when role is whitespace only", () => {
      expect(() => UserRole.create("   ")).toThrow("Role cannot be empty");
    });

    it("should throw error when role is null", () => {
      expect(() => UserRole.create(null as any)).toThrow(
        "Role cannot be empty",
      );
    });

    it("should throw error when role is undefined", () => {
      expect(() => UserRole.create(undefined as any)).toThrow(
        "Role cannot be empty",
      );
    });

    it("should throw error for invalid role", () => {
      const invalidRoles = [
        "SUPER_ADMIN",
        "MODERATOR",
        "USER",
        "GUEST",
        "HACKER",
        "ROOT",
        "INVALID",
      ];

      invalidRoles.forEach((invalidRole) => {
        expect(() => UserRole.create(invalidRole)).toThrow("Invalid role");
      });
    });

    it("should include valid roles in error message", () => {
      try {
        UserRole.create("INVALID");
        expect.fail("Should have thrown error");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        expect(errorMessage).toContain("BASIC");
        expect(errorMessage).toContain("ADMIN");
      }
    });
  });

  describe("singleton behavior", () => {
    it("should return same instance for same role value", () => {
      const role1 = UserRole.create("BASIC");
      const role2 = UserRole.create("BASIC");

      expect(role1).toBe(role2);
    });

    it("should return same instance regardless of case", () => {
      const role1 = UserRole.create("basic");
      const role2 = UserRole.create("BASIC");
      const role3 = UserRole.create("BaSiC");

      expect(role1).toBe(role2);
      expect(role2).toBe(role3);
    });

    it("should return same instance when trimming whitespace", () => {
      const role1 = UserRole.create("  BASIC  ");
      const role2 = UserRole.create("BASIC");

      expect(role1).toBe(role2);
    });

    it("should return different instances for different roles", () => {
      const basicRole = UserRole.create("BASIC");
      const adminRole = UserRole.create("ADMIN");

      expect(basicRole).not.toBe(adminRole);
    });

    it("should use predefined constants", () => {
      const role = UserRole.create("BASIC");

      expect(role).toBe(UserRole.BASIC);
    });
  });

  describe("toString", () => {
    it("should return role string value", () => {
      expect(UserRole.BASIC.toString()).toBe("BASIC");
      expect(UserRole.ADMIN.toString()).toBe("ADMIN");
    });

    it("should return same value on multiple calls", () => {
      const role = UserRole.BASIC;
      const firstCall = role.toString();
      const secondCall = role.toString();

      expect(firstCall).toBe(secondCall);
    });
  });

  describe("equals", () => {
    it("should return true when comparing same role values", () => {
      const role1 = UserRole.create("BASIC");
      const role2 = UserRole.create("BASIC");

      expect(role1.equals(role2)).toBe(true);
    });

    it("should return false when comparing different role values", () => {
      const basicRole = UserRole.BASIC;
      const adminRole = UserRole.ADMIN;

      expect(basicRole.equals(adminRole)).toBe(false);
    });

    it("should return false when comparing with null", () => {
      const role = UserRole.BASIC;

      expect(role.equals(null as any)).toBe(false);
    });

    it("should return false when comparing with undefined", () => {
      const role = UserRole.BASIC;

      expect(role.equals(undefined as any)).toBe(false);
    });

    it("should be reflexive (a.equals(a) === true)", () => {
      const role = UserRole.BASIC;

      expect(role.equals(role)).toBe(true);
    });

    it("should be symmetric (a.equals(b) === b.equals(a))", () => {
      const role1 = UserRole.create("BASIC");
      const role2 = UserRole.create("BASIC");

      expect(role1.equals(role2)).toBe(role2.equals(role1));
    });

    it("should be transitive (if a.equals(b) and b.equals(c), then a.equals(c))", () => {
      const role1 = UserRole.create("BASIC");
      const role2 = UserRole.create("BASIC");
      const role3 = UserRole.create("BASIC");

      expect(role1.equals(role2)).toBe(true);
      expect(role2.equals(role3)).toBe(true);
      expect(role1.equals(role3)).toBe(true);
    });
  });

  describe("domain methods", () => {
    describe("isAdmin", () => {
      it("should return true for ADMIN role", () => {
        const adminRole = UserRole.ADMIN;

        expect(adminRole.isAdmin()).toBe(true);
      });

      it("should return false for BASIC role", () => {
        const basicRole = UserRole.BASIC;

        expect(basicRole.isAdmin()).toBe(false);
      });
    });

    describe("isBasic", () => {
      it("should return true for BASIC role", () => {
        const basicRole = UserRole.BASIC;

        expect(basicRole.isBasic()).toBe(true);
      });

      it("should return false for ADMIN role", () => {
        const adminRole = UserRole.ADMIN;

        expect(adminRole.isBasic()).toBe(false);
      });
    });

    describe("canManageUsers", () => {
      it("should return true for ADMIN role", () => {
        const adminRole = UserRole.ADMIN;

        expect(adminRole.canManageUsers()).toBe(true);
      });

      it("should return false for BASIC role", () => {
        const basicRole = UserRole.BASIC;

        expect(basicRole.canManageUsers()).toBe(false);
      });
    });

    describe("canDeleteContent", () => {
      it("should return true for ADMIN role", () => {
        const adminRole = UserRole.ADMIN;

        expect(adminRole.canDeleteContent()).toBe(true);
      });

      it("should return false for BASIC role", () => {
        const basicRole = UserRole.BASIC;

        expect(basicRole.canDeleteContent()).toBe(false);
      });
    });

    describe("canEditOwnContent", () => {
      it("should return true for ADMIN role", () => {
        const adminRole = UserRole.ADMIN;

        expect(adminRole.canEditOwnContent()).toBe(true);
      });

      it("should return true for BASIC role", () => {
        const basicRole = UserRole.BASIC;

        expect(basicRole.canEditOwnContent()).toBe(true);
      });
    });
  });

  describe("immutability", () => {
    it("should maintain same value after multiple operations", () => {
      const role = UserRole.BASIC;

      role.toString();
      role.isAdmin();
      role.isBasic();
      role.canManageUsers();
      role.equals(UserRole.ADMIN);

      expect(role.toString()).toBe("BASIC");
      expect(role).toBe(UserRole.BASIC);
    });
  });

  describe("serialization", () => {
    it("should serialize to string value in JSON", () => {
      const data = {
        role: UserRole.ADMIN,
      };

      const json = JSON.stringify(data);

      expect(json).toBe('{"role":"ADMIN"}');
    });

    it("should serialize BASIC role correctly", () => {
      const data = {
        role: UserRole.BASIC,
      };

      const json = JSON.stringify(data);

      expect(json).toBe('{"role":"BASIC"}');
    });

    it("should serialize in nested objects", () => {
      const user = {
        name: "John Doe",
        role: UserRole.ADMIN,
        email: "john@example.com",
      };

      const json = JSON.stringify(user);
      const parsed = JSON.parse(json);

      expect(parsed.role).toBe("ADMIN");
    });

    it("should serialize in arrays", () => {
      const roles = [UserRole.BASIC, UserRole.ADMIN];

      const json = JSON.stringify(roles);

      expect(json).toBe('["BASIC","ADMIN"]');
    });

    it("should be deserializable from JSON", () => {
      const json = '{"role":"ADMIN"}';
      const parsed = JSON.parse(json);

      const role = UserRole.create(parsed.role);

      expect(role).toBe(UserRole.ADMIN);
    });

    it("should maintain singleton after deserialization", () => {
      const original = { role: UserRole.BASIC };
      const json = JSON.stringify(original);
      const parsed = JSON.parse(json);
      const deserialized = UserRole.create(parsed.role);

      expect(deserialized).toBe(UserRole.BASIC);
    });

    it("should work in API response simulation", () => {
      const apiResponse = {
        user: {
          id: "123",
          name: "John",
          role: UserRole.ADMIN,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      const json = JSON.stringify(apiResponse);
      const parsed = JSON.parse(json);

      expect(parsed.user.role).toBe("ADMIN");
      expect(typeof parsed.user.role).toBe("string");
    });
  });

  describe("toString", () => {
    it("should return role string value", () => {
      expect(UserRole.BASIC.toString()).toBe("BASIC");
      expect(UserRole.ADMIN.toString()).toBe("ADMIN");
    });

    it("should work in string interpolation", () => {
      const role = UserRole.ADMIN;
      const message = `User role is: ${role}`;

      expect(message).toBe("User role is: ADMIN");
    });

    it("should work with String() constructor", () => {
      const role = UserRole.BASIC;
      const str = String(role);

      expect(str).toBe("BASIC");
    });
  });
});
