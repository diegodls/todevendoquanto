// core/entities/user/value-objects/email.ts

export class Email {
  private readonly _value: string;

  private constructor(email: string) {
    this._value = email;
  }

  public static create(email: string): Email {
    if (!email || email.trim().length === 0) {
      throw new Error("Email cannot be empty");
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!this.isValid(trimmedEmail)) {
      throw new Error("Email format is invalid");
    }

    if (trimmedEmail.length > 254) {
      throw new Error("Email exceeds maximum length of 254 characters");
    }

    return new Email(trimmedEmail);
  }

  private static isValid(email: string): boolean {
    // RFC 5322
    const emailRegex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    if (!emailRegex.test(email)) {
      return false;
    }

    const [localPart, domain] = email.split("@");

    if (localPart.length > 64) {
      return false;
    }

    if (domain.length > 253) {
      return false;
    }

    if (email.includes("..")) {
      return false;
    }

    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      return false;
    }

    return true;
  }

  public toString(): string {
    return this._value;
  }

  public getLocalPart(): string {
    return this._value.split("@")[0];
  }

  public getDomain(): string {
    return this._value.split("@")[1];
  }

  public equals(other: Email): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  public isSameDomain(other: Email): boolean {
    if (!other) return false;
    return this.getDomain() === other.getDomain();
  }
}
