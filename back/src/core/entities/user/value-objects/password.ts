import {
  CommonPasswordError,
  PasswordEmptyError,
  PasswordHashedEmptyError,
  PasswordHashedError,
  PasswordInvalidHash,
  PasswordMissingLowercaseError,
  PasswordMissingNumberError,
  PasswordMissingSpecialCharacterError,
  PasswordMissingUppercaseError,
  PasswordTooLongError,
  PasswordTooShortError,
} from "@/core/shared/errors/domain";

export class Password {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(password: string): Password {
    if (!password) {
      throw new PasswordEmptyError();
    }

    if (password.length < 8) {
      throw new PasswordTooShortError();
    }

    if (password.length > 128) {
      throw new PasswordTooLongError();
    }

    this.validateComplexity(password);

    return new Password(password);
  }

  public static fromHash(hash: string): Password {
    if (!hash || hash === null || hash === undefined) {
      throw new PasswordHashedEmptyError();
    }

    if (!hash.startsWith("$2")) {
      throw new PasswordInvalidHash();
    }

    if (hash.length !== 60) {
      throw new PasswordInvalidHash();
    }

    return new Password(hash);
  }

  private static validateComplexity(password: string): void {
    if (this.isCommonPassword(password)) {
      throw new CommonPasswordError();
    }

    if (!/[A-Z]/.test(password)) {
      throw new PasswordMissingUppercaseError();
    }

    if (!/[a-z]/.test(password)) {
      throw new PasswordMissingLowercaseError();
    }

    if (!/[0-9]/.test(password)) {
      throw new PasswordMissingNumberError();
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      throw new PasswordMissingSpecialCharacterError();
    }

    if (password.startsWith("$2")) {
      throw new PasswordHashedError();
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
