import {
  PasswordEmptyError,
  PasswordMissingLowercaseError,
  PasswordMissingNumberError,
  PasswordMissingSpecialCharacterError,
  PasswordMissingUppercaseError,
  PasswordTooCommonError,
  PasswordTooLongError,
  PasswordTooShortError,
} from "@/core/shared/errors/domain/user-value-object-errors";

export class Password {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(password: string): Password {
    if (!password) {
      throw new PasswordEmptyError("Password cannot be empty");
    }

    if (password.length < 8) {
      throw new PasswordTooShortError("Password must have at least 8 characters");
    }

    if (password.length > 128) {
      throw new PasswordTooLongError(
        "Password exceeds maximum length of 128 characters",
      );
    }

    this.validateComplexity(password);

    return new Password(password);
  }

  private static validateComplexity(password: string): void {
    if (this.isCommonPassword(password)) {
      throw new PasswordTooCommonError("Password is too common");
    }

    if (!/[A-Z]/.test(password)) {
      throw new PasswordMissingUppercaseError(
        "Password must contain at least one uppercase letter",
      );
    }

    if (!/[a-z]/.test(password)) {
      throw new PasswordMissingLowercaseError(
        "Password must contain at least one lowercase letter",
      );
    }

    if (!/[0-9]/.test(password)) {
      throw new PasswordMissingNumberError(
        "Password must contain at least one number",
      );
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      throw new PasswordMissingSpecialCharacterError(
        "Password must contain at least one special character",
      );
    }
  }

  private static isCommonPassword(password: string): boolean {
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

    return commonPasswords.some(
      (common) => password.toLowerCase() === common.toLowerCase(),
    );
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Password): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public toJSON(): string {
    return "[REDACTED]";
  }
}
