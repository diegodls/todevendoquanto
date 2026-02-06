// core/entities/user/value-objects/email.spec.ts

import { describe, expect, it } from "vitest";
import { Email } from "./user-email";

describe("Email", () => {
  describe("create", () => {
    it("should create email with valid format", () => {
      const validEmails = [
        "user@example.com",
        "john.doe@company.co.uk",
        "test+tag@domain.org",
        "user_name@sub.domain.com",
        "a@b.c",
        "123@numbers.com",
        "test@test-domain.com",
      ];

      validEmails.forEach((validEmail) => {
        const email = Email.create(validEmail);

        expect(email).toBeInstanceOf(Email);
        expect(email.toString()).toBe(validEmail.toLowerCase());
      });
    });

    it("should normalize email to lowercase", () => {
      const email = Email.create("USER@EXAMPLE.COM");

      expect(email.toString()).toBe("user@example.com");
    });

    it("should trim whitespace from email", () => {
      const email = Email.create("  user@example.com  ");

      expect(email.toString()).toBe("user@example.com");
    });

    it("should normalize and trim together", () => {
      const email = Email.create("  USER@EXAMPLE.COM  ");

      expect(email.toString()).toBe("user@example.com");
    });

    it("should throw error when email is empty string", () => {
      expect(() => Email.create("")).toThrow("Email cannot be empty");
    });

    it("should throw error when email is whitespace only", () => {
      expect(() => Email.create("   ")).toThrow("Email cannot be empty");
    });

    it("should throw error when email is null", () => {
      expect(() => Email.create(null as any)).toThrow("Email cannot be empty");
    });

    it("should throw error when email is undefined", () => {
      expect(() => Email.create(undefined as any)).toThrow(
        "Email cannot be empty",
      );
    });

    it("should throw error when email has no @ symbol", () => {
      const invalidEmails = ["userexample.com", "user.example.com", "user"];

      invalidEmails.forEach((invalidEmail) => {
        expect(() => Email.create(invalidEmail)).toThrow(
          "Email format is invalid",
        );
      });
    });

    it("should throw error when email has multiple @ symbols", () => {
      const invalidEmails = [
        "user@@example.com",
        "user@domain@example.com",
        "@user@example.com",
      ];

      invalidEmails.forEach((invalidEmail) => {
        expect(() => Email.create(invalidEmail)).toThrow(
          "Email format is invalid",
        );
      });
    });

    it("should throw error when email has no local part", () => {
      const invalidEmails = ["@example.com", "@"];

      invalidEmails.forEach((invalidEmail) => {
        expect(() => Email.create(invalidEmail)).toThrow(
          "Email format is invalid",
        );
      });
    });

    it("should throw error when email has no domain", () => {
      const invalidEmails = ["user@", "@"];

      invalidEmails.forEach((invalidEmail) => {
        expect(() => Email.create(invalidEmail)).toThrow(
          "Email format is invalid",
        );
      });
    });

    it("should throw error when email exceeds 254 characters", () => {
      const longLocalPart = "a".repeat(254);
      const longEmail = `${longLocalPart}@example.com`;

      expect(() => Email.create(longEmail)).toThrow("Email format is invalid");
    });

    it("should throw error when local part exceeds 64 characters", () => {
      const longLocalPart = "a".repeat(65);
      const email = `${longLocalPart}@example.com`;

      expect(() => Email.create(email)).toThrow("Email format is invalid");
    });

    it("should throw error when domain exceeds 253 characters", () => {
      const longDomain = "a".repeat(253);
      const email = `u@${longDomain}.com`;

      expect(() => Email.create(email)).toThrow("Email format is invalid");
    });

    it("should throw error when email contains consecutive dots", () => {
      const invalidEmails = [
        "user..name@example.com",
        "user@domain..com",
        "user...test@example.com",
      ];

      invalidEmails.forEach((invalidEmail) => {
        expect(() => Email.create(invalidEmail)).toThrow(
          "Email format is invalid",
        );
      });
    });

    it("should throw error when local part starts with dot", () => {
      expect(() => Email.create(".user@example.com")).toThrow(
        "Email format is invalid",
      );
    });

    it("should throw error when local part ends with dot", () => {
      expect(() => Email.create("user.@example.com")).toThrow(
        "Email format is invalid",
      );
    });

    it("should throw error when domain has invalid characters", () => {
      const invalidEmails = [
        "user@domain!.com",
        "user@dom ain.com",
        "user@domain$.com",
      ];

      invalidEmails.forEach((invalidEmail) => {
        expect(() => Email.create(invalidEmail)).toThrow(
          "Email format is invalid",
        );
      });
    });

    it("should throw error when local part has invalid characters", () => {
      const invalidEmails = [
        "user name@example.com",
        "user(name)@example.com",
        "user[name]@example.com",
      ];

      invalidEmails.forEach((invalidEmail) => {
        expect(() => Email.create(invalidEmail)).toThrow(
          "Email format is invalid",
        );
      });
    });

    it("should accept valid special characters in local part", () => {
      const validEmails = [
        "user+tag@example.com",
        "user_name@example.com",
        "user-name@example.com",
        "user.name@example.com",
        "user'name@example.com",
        "user!name@example.com",
        "user#name@example.com",
        "user$name@example.com",
        "user%name@example.com",
        "user&name@example.com",
        "user*name@example.com",
        "user=name@example.com",
        "user?name@example.com",
        "user^name@example.com",
        "user`name@example.com",
        "user{name@example.com",
        "user|name@example.com",
        "user}name@example.com",
        "user~name@example.com",
      ];

      validEmails.forEach((validEmail) => {
        expect(() => Email.create(validEmail)).not.toThrow();
      });
    });

    it("should accept hyphen in domain", () => {
      const email = Email.create("user@test-domain.com");

      expect(email.toString()).toBe("user@test-domain.com");
    });

    it("should accept subdomain", () => {
      const email = Email.create("user@mail.example.com");

      expect(email.toString()).toBe("user@mail.example.com");
    });

    it("should accept multiple subdomains", () => {
      const email = Email.create("user@mail.server.example.com");

      expect(email.toString()).toBe("user@mail.server.example.com");
    });
  });

  describe("toString", () => {
    it("should return normalized email string", () => {
      const email = Email.create("USER@EXAMPLE.COM");

      expect(email.toString()).toBe("user@example.com");
    });

    it("should return same value on multiple calls", () => {
      const email = Email.create("user@example.com");
      const firstCall = email.toString();
      const secondCall = email.toString();

      expect(firstCall).toBe(secondCall);
    });
  });

  describe("getLocalPart", () => {
    it("should return local part of email", () => {
      const email = Email.create("username@example.com");

      expect(email.getLocalPart()).toBe("username");
    });

    it("should return normalized local part", () => {
      const email = Email.create("UserName@example.com");

      expect(email.getLocalPart()).toBe("username");
    });

    it("should handle local part with special characters", () => {
      const email = Email.create("user+tag@example.com");

      expect(email.getLocalPart()).toBe("user+tag");
    });
  });

  describe("getDomain", () => {
    it("should return domain part of email", () => {
      const email = Email.create("user@example.com");

      expect(email.getDomain()).toBe("example.com");
    });

    it("should return normalized domain", () => {
      const email = Email.create("user@EXAMPLE.COM");

      expect(email.getDomain()).toBe("example.com");
    });

    it("should handle subdomain", () => {
      const email = Email.create("user@mail.example.com");

      expect(email.getDomain()).toBe("mail.example.com");
    });
  });

  describe("equals", () => {
    it("should return true when comparing same email values", () => {
      const email1 = Email.create("user@example.com");
      const email2 = Email.create("user@example.com");

      expect(email1.equals(email2)).toBe(true);
    });

    it("should return true when comparing emails with different casing", () => {
      const email1 = Email.create("USER@EXAMPLE.COM");
      const email2 = Email.create("user@example.com");

      expect(email1.equals(email2)).toBe(true);
    });

    it("should return true when comparing emails with different whitespace", () => {
      const email1 = Email.create("  user@example.com  ");
      const email2 = Email.create("user@example.com");

      expect(email1.equals(email2)).toBe(true);
    });

    it("should return false when comparing different email values", () => {
      const email1 = Email.create("user1@example.com");
      const email2 = Email.create("user2@example.com");

      expect(email1.equals(email2)).toBe(false);
    });

    it("should return false when comparing with null", () => {
      const email = Email.create("user@example.com");

      expect(email.equals(null as any)).toBe(false);
    });

    it("should return false when comparing with undefined", () => {
      const email = Email.create("user@example.com");

      expect(email.equals(undefined as any)).toBe(false);
    });

    it("should be reflexive (a.equals(a) === true)", () => {
      const email = Email.create("user@example.com");

      expect(email.equals(email)).toBe(true);
    });

    it("should be symmetric (a.equals(b) === b.equals(a))", () => {
      const email1 = Email.create("user@example.com");
      const email2 = Email.create("user@example.com");

      expect(email1.equals(email2)).toBe(email2.equals(email1));
    });

    it("should be transitive (if a.equals(b) and b.equals(c), then a.equals(c))", () => {
      const email1 = Email.create("user@example.com");
      const email2 = Email.create("USER@example.com");
      const email3 = Email.create("user@EXAMPLE.COM");

      expect(email1.equals(email2)).toBe(true);
      expect(email2.equals(email3)).toBe(true);
      expect(email1.equals(email3)).toBe(true);
    });
  });

  describe("isSameDomain", () => {
    it("should return true when emails have same domain", () => {
      const email1 = Email.create("user1@example.com");
      const email2 = Email.create("user2@example.com");

      expect(email1.isSameDomain(email2)).toBe(true);
    });

    it("should return true when emails have same domain with different casing", () => {
      const email1 = Email.create("user1@EXAMPLE.COM");
      const email2 = Email.create("user2@example.com");

      expect(email1.isSameDomain(email2)).toBe(true);
    });

    it("should return false when emails have different domains", () => {
      const email1 = Email.create("user@example.com");
      const email2 = Email.create("user@different.com");

      expect(email1.isSameDomain(email2)).toBe(false);
    });

    it("should return false when emails have same TLD but different domains", () => {
      const email1 = Email.create("user@example.com");
      const email2 = Email.create("user@another.com");

      expect(email1.isSameDomain(email2)).toBe(false);
    });

    it("should return false when comparing with null", () => {
      const email = Email.create("user@example.com");

      expect(email.isSameDomain(null as any)).toBe(false);
    });

    it("should return false when comparing with undefined", () => {
      const email = Email.create("user@example.com");

      expect(email.isSameDomain(undefined as any)).toBe(false);
    });

    it("should handle subdomains correctly", () => {
      const email1 = Email.create("user@mail.example.com");
      const email2 = Email.create("user@example.com");

      expect(email1.isSameDomain(email2)).toBe(false);
    });

    it("should return true for same subdomain", () => {
      const email1 = Email.create("user1@mail.example.com");
      const email2 = Email.create("user2@mail.example.com");

      expect(email1.isSameDomain(email2)).toBe(true);
    });
  });

  describe("immutability", () => {
    it("should maintain same value after multiple operations", () => {
      const email = Email.create("user@example.com");

      email.toString();
      email.getLocalPart();
      email.getDomain();
      email.equals(Email.create("other@example.com"));
      email.isSameDomain(Email.create("another@example.com"));

      expect(email.toString()).toBe("user@example.com");
    });
  });
});
