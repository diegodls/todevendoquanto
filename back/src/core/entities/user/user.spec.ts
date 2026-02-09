// core/entities/user/user.entity.spec.ts

import { describe, expect, it } from "vitest";
import { User } from "./user";
import { Email } from "./value-objects/user-email";
import { UserId } from "./value-objects/user-id";
import { UserRole } from "./value-objects/user-role";

describe("User Entity", () => {
  const validHashedPassword =
    "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

  describe("create", () => {
    it("should create a new user with valid data", () => {
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      expect(user).toBeInstanceOf(User);
      expect(user.name).toBe("John Doe");
      expect(user.email.toString()).toBe("john@example.com");
      expect(user.role).toBe(UserRole.BASIC);
      expect(user.isActive).toBe(true);
    });

    it("should create user with ADMIN role when specified", () => {
      const user = User.create(
        {
          name: "Admin User",
          email: "admin@example.com",

          role: "ADMIN",
        },
        validHashedPassword,
      );

      expect(user.role).toBe(UserRole.ADMIN);
    });

    it("should generate unique ID for each user", () => {
      const user1 = User.create(
        {
          name: "User One",
          email: "user1@example.com",
        },
        validHashedPassword,
      );

      const user2 = User.create(
        {
          name: "User Two",
          email: "user2@example.com",
        },
        validHashedPassword,
      );

      expect(user1.id.equals(user2.id)).toBe(false);
    });

    it("should set createdAt and updatedAt to current date", () => {
      const before = new Date();
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );
      const after = new Date();

      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(user.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it("should trim whitespace from name", () => {
      const user = User.create(
        {
          name: "  John Doe  ",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      expect(user.name).toBe("John Doe");
    });

    it("should throw error when name is empty", () => {
      expect(() =>
        User.create(
          {
            name: "",
            email: "john@example.com",
          },
          validHashedPassword,
        ),
      ).toThrow("Name cannot be empty");
    });

    it("should throw error when name is whitespace only", () => {
      expect(() =>
        User.create(
          {
            name: "   ",
            email: "john@example.com",
          },
          validHashedPassword,
        ),
      ).toThrow("Name cannot be empty");
    });

    it("should throw error when name has less than 2 characters", () => {
      expect(() =>
        User.create(
          {
            name: "J",
            email: "john@example.com",
          },
          validHashedPassword,
        ),
      ).toThrow("Name must have at least 2 characters");
    });

    it("should throw error when name exceeds 100 characters", () => {
      const longName = "J".repeat(101);

      expect(() =>
        User.create(
          {
            name: longName,
            email: "john@example.com",
          },
          validHashedPassword,
        ),
      ).toThrow("Name exceeds maximum length of 100 characters");
    });

    it("should accept name with exactly 2 characters", () => {
      const user = User.create(
        {
          name: "Jo",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      expect(user.name).toBe("Jo");
    });

    it("should accept name with exactly 100 characters", () => {
      const name = "J".repeat(100);
      const user = User.create(
        {
          name,
          email: "john@example.com",
        },
        validHashedPassword,
      );

      expect(user.name).toBe(name);
    });

    it("should throw error when name contains invalid characters", () => {
      const invalidNames = [
        "John123",
        "John@Doe",
        "John#Doe",
        "John$Doe",
        "John_Doe",
        "John.Doe",
      ];

      invalidNames.forEach((invalidName) => {
        expect(() =>
          User.create(
            {
              name: invalidName,
              email: "john@example.com",
            },
            validHashedPassword,
          ),
        ).toThrow("Name contains invalid characters");
      });
    });

    it("should accept name with valid special characters", () => {
      const validNames = [
        "O'Brien",
        "Mary-Jane",
        "Jean-Claude",
        "María José",
        "François",
        "José María",
      ];

      validNames.forEach((validName) => {
        const user = User.create(
          {
            name: validName,
            email: "john@example.com",
          },
          validHashedPassword,
        );

        expect(user.name).toBe(validName);
      });
    });

    it("should throw error when email is invalid", () => {
      expect(() =>
        User.create(
          {
            name: "John Doe",
            email: "invalid-email",
          },
          validHashedPassword,
        ),
      ).toThrow("Email format is invalid");
    });

    it("should throw error when role is invalid", () => {
      expect(() =>
        User.create(
          {
            name: "John Doe",
            email: "john@example.com",

            role: "INVALID_ROLE",
          },
          validHashedPassword,
        ),
      ).toThrow("Invalid role");
    });
  });

  describe("reconstitute", () => {
    it("should reconstitute user from database data", () => {
      const props = {
        id: UserId.from("550e8400-e29b-41d4-a716-446655440000"),
        name: "John Doe",
        email: Email.create("john@example.com"),
        hashedPassword: validHashedPassword,
        role: UserRole.ADMIN,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        isActive: true,
      };

      const user = User.reconstitute(props);

      expect(user.id.toString()).toBe("550e8400-e29b-41d4-a716-446655440000");
      expect(user.name).toBe("John Doe");
      expect(user.email.toString()).toBe("john@example.com");
      expect(user.hashedPassword).toBe(validHashedPassword);
      expect(user.role).toBe(UserRole.ADMIN);
      expect(user.createdAt).toEqual(new Date("2024-01-01"));
      expect(user.updatedAt).toEqual(new Date("2024-01-02"));
      expect(user.isActive).toBe(true);
    });

    it("should throw error when required fields are missing", () => {
      expect(() =>
        User.reconstitute({
          id: null as any,
          name: "John",
          email: Email.create("john@example.com"),
          hashedPassword: validHashedPassword,
          role: UserRole.BASIC,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
        }),
      ).toThrow("User ID is required");
    });
  });

  describe("changeName", () => {
    it("should change user name", () => {
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      const oldUpdatedAt = user.updatedAt;

      // Pequeno delay para garantir que updatedAt muda
      setTimeout(() => {
        user.changeName("Jane Doe");

        expect(user.name).toBe("Jane Doe");
        expect(user.updatedAt.getTime()).toBeGreaterThan(
          oldUpdatedAt.getTime(),
        );
      }, 10);
    });

    it("should throw error when new name is empty", () => {
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      expect(() => user.changeName("")).toThrow("Name cannot be empty");
    });

    it("should throw error when new name is invalid", () => {
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      expect(() => user.changeName("J")).toThrow(
        "Name must have at least 2 characters",
      );
      expect(() => user.changeName("John123")).toThrow(
        "Name contains invalid characters",
      );
    });
  });

  describe("changeEmail", () => {
    it("should change user email", () => {
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      user.changeEmail("newemail@example.com");

      expect(user.email.toString()).toBe("newemail@example.com");
    });

    it("should throw error when new email is invalid", () => {
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      expect(() => user.changeEmail("invalid-email")).toThrow(
        "Email format is invalid",
      );
    });
  });

  describe("changePassword", () => {
    it("should change user password", () => {
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      const newHashedPassword = "$2b$10$DifferentHashHere";
      user.changePassword(newHashedPassword);

      expect(user.hashedPassword).toBe(newHashedPassword);
    });

    it("should throw error when new password is empty", () => {
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      expect(() => user.changePassword("")).toThrow("Password cannot be empty");
    });
  });

  describe("role management", () => {
    it("should promote user to admin", () => {
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      expect(user.role).toBe(UserRole.BASIC);

      user.promoteToAdmin();

      expect(user.role).toBe(UserRole.ADMIN);
    });

    it("should demote admin to basic", () => {
      const user = User.create(
        {
          name: "Admin User",
          email: "admin@example.com",

          role: "ADMIN",
        },
        validHashedPassword,
      );

      expect(user.role).toBe(UserRole.ADMIN);

      user.demoteToBasic();

      expect(user.role).toBe(UserRole.BASIC);
    });
  });

  describe("activation management", () => {
    it("should activate inactive user", () => {
      const user = User.reconstitute({
        id: UserId.create(),
        name: "John Doe",
        email: Email.create("john@example.com"),
        hashedPassword: validHashedPassword,
        role: UserRole.BASIC,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false,
      });

      user.activate();

      expect(user.isActive).toBe(true);
    });

    it("should throw error when activating already active user", () => {
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      expect(() => user.activate()).toThrow("User is already active");
    });

    it("should deactivate active user", () => {
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      user.deactivate();

      expect(user.isActive).toBe(false);
    });

    it("should throw error when deactivating already inactive user", () => {
      const user = User.reconstitute({
        id: UserId.create(),
        name: "John Doe",
        email: Email.create("john@example.com"),
        hashedPassword: validHashedPassword,
        role: UserRole.BASIC,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false,
      });

      expect(() => user.deactivate()).toThrow("User is already inactive");
    });
  });

  describe("domain behavior", () => {
    it("should check if user is admin", () => {
      const basicUser = User.create(
        {
          name: "Basic User",
          email: "basic@example.com",
        },
        validHashedPassword,
      );

      const adminUser = User.create(
        {
          name: "Admin User",
          email: "admin@example.com",

          role: "ADMIN",
        },
        validHashedPassword,
      );

      expect(basicUser.isAdmin()).toBe(false);
      expect(adminUser.isAdmin()).toBe(true);
    });

    it("should check if user can manage other users", () => {
      const basicUser = User.create(
        {
          name: "Basic User",
          email: "basic@example.com",
        },
        validHashedPassword,
      );

      const adminUser = User.create(
        {
          name: "Admin User",
          email: "admin@example.com",

          role: "ADMIN",
        },
        validHashedPassword,
      );

      expect(basicUser.canManageUsers()).toBe(false);
      expect(adminUser.canManageUsers()).toBe(true);
    });

    it("should check if users are from same domain", () => {
      const user1 = User.create(
        {
          name: "User One",
          email: "user1@example.com",
        },
        validHashedPassword,
      );

      const user2 = User.create(
        {
          name: "User Two",
          email: "user2@example.com",
        },
        validHashedPassword,
      );

      const user3 = User.create(
        {
          name: "User Three",
          email: "user3@different.com",
        },
        validHashedPassword,
      );

      expect(user1.isSameDomain(user2)).toBe(true);
      expect(user1.isSameDomain(user3)).toBe(false);
    });
  });

  describe("equals", () => {
    it("should return true when comparing users with same ID", () => {
      const userId = UserId.create();

      const user1 = User.reconstitute({
        id: userId,
        name: "John Doe",
        email: Email.create("john@example.com"),
        hashedPassword: validHashedPassword,
        role: UserRole.BASIC,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      });

      const user2 = User.reconstitute({
        id: userId,
        name: "Different Name",
        email: Email.create("different@example.com"),
        hashedPassword: validHashedPassword,
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false,
      });

      expect(user1.equals(user2)).toBe(true);
    });

    it("should return false when comparing users with different IDs", () => {
      const user1 = User.create(
        {
          name: "User One",
          email: "user1@example.com",
        },
        validHashedPassword,
      );

      const user2 = User.create(
        {
          name: "User Two",
          email: "user2@example.com",
        },
        validHashedPassword,
      );

      expect(user1.equals(user2)).toBe(false);
    });

    it("should return false when comparing with null", () => {
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      expect(user.equals(null as any)).toBe(false);
    });
  });

  describe("serialization", () => {
    it("should serialize to JSON with all fields including hashedPassword", () => {
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      const json = user.toJSON();

      expect(json).toHaveProperty("id");
      expect(json).toHaveProperty("name", "John Doe");
      expect(json).toHaveProperty("email", "john@example.com");
      expect(json).toHaveProperty("hashedPassword", validHashedPassword);
      expect(json).toHaveProperty("role", "BASIC");
      expect(json).toHaveProperty("createdAt");
      expect(json).toHaveProperty("updatedAt");
      expect(json).toHaveProperty("isActive", true);
    });

    it("should serialize to public format without hashedPassword", () => {
      const user = User.create(
        {
          name: "John Doe",
          email: "john@example.com",
        },
        validHashedPassword,
      );

      const publicData = user.toPublic();

      expect(publicData).toHaveProperty("id");
      expect(publicData).toHaveProperty("name", "John Doe");
      expect(publicData).toHaveProperty("email", "john@example.com");
      expect(publicData).not.toHaveProperty("hashedPassword");
      expect(publicData).not.toHaveProperty("password");
      expect(publicData).toHaveProperty("role", "BASIC");
      expect(publicData).toHaveProperty("createdAt");
      expect(publicData).toHaveProperty("updatedAt");
      expect(publicData).toHaveProperty("isActive", true);
    });
  });
});
