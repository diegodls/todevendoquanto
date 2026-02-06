import { describe, expect, it } from "vitest";
import { Password } from "./password";

describe("Password", () => {
  describe("create", () => {
    it("should create password with valid format", () => {
      const validPasswords = [
        "Secret123!",
        "MyP@ssw0rd",
        "C0mpl3x!Pass",
        "Str0ng#Secure",
        "V@lid1Password",
        "T3st!ng123",
        "8Ch@rs1!",
      ];

      validPasswords.forEach((validPassword) => {
        const password = Password.create(validPassword);

        expect(password).toBeInstanceOf(Password);
        expect(password.getValue()).toBe(validPassword);
      });
    });

    it("should throw error when password is empty string", () => {
      expect(() => Password.create("")).toThrow("Password cannot be empty");
    });

    it("should throw error when password is null", () => {
      expect(() => Password.create(null as any)).toThrow(
        "Password cannot be empty",
      );
    });

    it("should throw error when password is undefined", () => {
      expect(() => Password.create(undefined as any)).toThrow(
        "Password cannot be empty",
      );
    });

    it("should throw error when password has less than 8 characters", () => {
      const shortPasswords = ["Ab1!", "Short1!", "A1!bcde"];

      shortPasswords.forEach((shortPassword) => {
        expect(() => Password.create(shortPassword)).toThrow(
          "Password must have at least 8 characters",
        );
      });
    });

    it("should throw error when password exceeds 128 characters", () => {
      const longPassword = "A1!" + "a".repeat(126);

      expect(() => Password.create(longPassword)).toThrow(
        "Password exceeds maximum length of 128 characters",
      );
    });

    it("should accept password with exactly 8 characters", () => {
      const password = Password.create("Abcd123!");

      expect(password.getValue()).toBe("Abcd123!");
    });

    it("should accept password with exactly 128 characters", () => {
      const longPassword = "A1!" + "a".repeat(124) + "Z";

      const password = Password.create(longPassword);

      expect(password.getValue()).toBe(longPassword);
    });

    it("should throw error when password has no uppercase letter", () => {
      const passwordsWithoutUppercase = [
        "validpassowrd0*",
        "secret123!",
        "myp@ssw0rd",
      ];

      passwordsWithoutUppercase.forEach((pwd) => {
        expect(() => Password.create(pwd)).toThrow(
          "Password must contain at least one uppercase letter",
        );
      });
    });

    it("should throw error when password has no lowercase letter", () => {
      const passwordsWithoutLowercase = [
        "VALIDPASSWORD0*",
        "SECRET123!",
        "MYP@SSW0RD",
      ];

      passwordsWithoutLowercase.forEach((pwd) => {
        expect(() => Password.create(pwd)).toThrow(
          "Password must contain at least one lowercase letter",
        );
      });
    });

    it("should throw error when password has no number", () => {
      const passwordsWithoutNumber = [
        "ValidPassword*",
        "Secret@Password",
        "MyP@ssword",
      ];

      passwordsWithoutNumber.forEach((pwd) => {
        expect(() => Password.create(pwd)).toThrow(
          "Password must contain at least one number",
        );
      });
    });

    it("should throw error when password has no special character", () => {
      const passwordsWithoutSpecial = [
        "Password123",
        "Secret123",
        "MyPassword1",
      ];

      passwordsWithoutSpecial.forEach((pwd) => {
        expect(() => Password.create(pwd)).toThrow(
          "Password must contain at least one special character",
        );
      });
    });

    it("should accept all valid special characters", () => {
      const specialChars = "!@#$%^&*()_+-=[]{};':\"|,.<>/?";

      specialChars.split("").forEach((char) => {
        const password = `Valid000Password${char}`;
        expect(() => Password.create(password)).not.toThrow();
      });
    });

    it("should throw error for common passwords", () => {
      const commonPasswords = [
        "12345678",
        "password",
        "Password1!",
        "Qwerty123!",
        "Abc12345!",
        "Welcome1!",
        "Password123!",
        "Admin123!",
        "Letmein1!",
        "P@ssw0rd",
        "P@ssword1",
        "Password!",
        "Qwerty1!",
        "Welcome123!",
      ];

      commonPasswords.forEach((commonPwd) => {
        expect(() => Password.create(commonPwd)).toThrow(
          "Password is too common",
        );
      });
    });

    it("should throw error for common passwords regardless of case", () => {
      const variations = [
        "PASSWORD1!",
        "password1!",
        "PaSsWoRd1!",
        "QWERTY123!",
        "qwerty123!",
      ];

      variations.forEach((variation) => {
        expect(() => Password.create(variation)).toThrow(
          "Password is too common",
        );
      });
    });

    it("should accept strong uncommon password", () => {
      const strongPasswords = [
        "MyUn1qu3!Pass",
        "Str0ng&Secure#",
        "C0mpl3x$Password",
        "V3ry!S3cur3",
      ];

      strongPasswords.forEach((strongPwd) => {
        expect(() => Password.create(strongPwd)).not.toThrow();
      });
    });

    it("should validate all requirements in order", () => {
      expect(() => Password.create("")).toThrow("Password cannot be empty");

      expect(() => Password.create("Ab1!")).toThrow(
        "must have at least 8 characters",
      );

      expect(() => Password.create("abcdefgh")).toThrow(
        "must contain at least one uppercase",
      );
      expect(() => Password.create("ABCDEFGH")).toThrow(
        "must contain at least one lowercase",
      );
      expect(() => Password.create("Abcdefgh")).toThrow(
        "must contain at least one number",
      );
      expect(() => Password.create("Abcdefg1")).toThrow(
        "must contain at least one special character",
      );

      expect(() => Password.create("Password1!")).toThrow(
        "Password is too common",
      );
    });
  });

  describe("getValue", () => {
    it("should return the password value", () => {
      const passwordString = "MyP@ssw0rd123";
      const password = Password.create(passwordString);

      expect(password.getValue()).toBe(passwordString);
    });

    it("should return same value on multiple calls", () => {
      const password = Password.create("Secret123!");
      const firstCall = password.getValue();
      const secondCall = password.getValue();

      expect(firstCall).toBe(secondCall);
    });

    it("should not expose password through toString", () => {
      const password = Password.create("Secret123!");

      const stringified = String(password);

      expect(stringified).not.toContain("Secret123!");
      expect(stringified).toMatch(/\[object Object\]/);
    });

    it("should not expose password through JSON.stringify", () => {
      const password = Password.create("Secret123!");
      const json = JSON.stringify({ password });

      expect(json).not.toContain("Secret123!");
    });
  });

  describe("equals", () => {
    it("should return true when comparing same password values", () => {
      const password1 = Password.create("MyP@ssw0rd123");
      const password2 = Password.create("MyP@ssw0rd123");

      expect(password1.equals(password2)).toBe(true);
    });

    it("should return false when comparing different password values", () => {
      const password1 = Password.create("MyP@ssw0rd123");
      const password2 = Password.create("Different1!");

      expect(password1.equals(password2)).toBe(false);
    });

    it("should be case sensitive", () => {
      const password1 = Password.create("MyP@ssw0rd123");
      const password2 = Password.create("myp@ssw0rD123");

      expect(password1.equals(password2)).toBe(false);
    });

    it("should return false when comparing with null", () => {
      const password = Password.create("MyP@ssw0rd123");

      expect(password.equals(null as any)).toBe(false);
    });

    it("should return false when comparing with undefined", () => {
      const password = Password.create("MyP@ssw0rd123");

      expect(password.equals(undefined as any)).toBe(false);
    });

    it("should be reflexive (a.equals(a) === true)", () => {
      const password = Password.create("MyP@ssw0rd123");

      expect(password.equals(password)).toBe(true);
    });

    it("should be symmetric (a.equals(b) === b.equals(a))", () => {
      const password1 = Password.create("MyP@ssw0rd123");
      const password2 = Password.create("MyP@ssw0rd123");

      expect(password1.equals(password2)).toBe(password2.equals(password1));
    });

    it("should be transitive (if a.equals(b) and b.equals(c), then a.equals(c))", () => {
      const password1 = Password.create("MyP@ssw0rd123");
      const password2 = Password.create("MyP@ssw0rd123");
      const password3 = Password.create("MyP@ssw0rd123");

      expect(password1.equals(password2)).toBe(true);
      expect(password2.equals(password3)).toBe(true);
      expect(password1.equals(password3)).toBe(true);
    });
  });

  describe("immutability", () => {
    it("should maintain same value after multiple operations", () => {
      const passwordString = "MyP@ssw0rd123";
      const password = Password.create(passwordString);

      password.getValue();
      password.equals(Password.create("Different1!"));
      password.getValue();

      expect(password.getValue()).toBe(passwordString);
    });
  });

  describe("security", () => {
    it("should not leak password in error messages", () => {
      const sensitivePassword = "MySecretP@ss123";

      try {
        const password = Password.create(sensitivePassword);
        password.equals(null as any);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        expect(errorMessage).not.toContain(sensitivePassword);
      }
    });
  });
});
