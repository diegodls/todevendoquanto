import { DomainError } from "../domain-error";

export class PasswordError extends DomainError {}

export class PasswordEmptyError extends PasswordError {
  constructor() {
    super("Password cannot be empty");
  }
}

export class PasswordTooShortError extends PasswordError {
  constructor() {
    super("Password must have at least 8 characters");
  }
}

export class PasswordTooLongError extends PasswordError {
  constructor() {
    super("Password exceeds maximum length of 128 characters");
  }
}

export class CommonPasswordError extends PasswordError {
  constructor() {
    super("Password is too common");
  }
}

export class PasswordMissingUppercaseError extends PasswordError {
  constructor() {
    super("Password must contain at least one uppercase letter");
  }
}

export class PasswordMissingLowercaseError extends PasswordError {
  constructor() {
    super("Password must contain at least one lowercase letter");
  }
}

export class PasswordMissingNumberError extends PasswordError {
  constructor() {
    super("Password must contain at least one number");
  }
}

export class PasswordMissingSpecialCharacterError extends PasswordError {
  constructor() {
    super("Password must contain at least one special character");
  }
}
