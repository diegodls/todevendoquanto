import { DomainError } from "../domain-error";

export class EmailError extends DomainError {}

export class EmailEmptyError extends EmailError {
  constructor() {
    super("Email cannot be empty");
  }
}

export class InvalidEmailFormatError extends EmailError {
  constructor() {
    super("Email format is invalid");
  }
}

export class EmailTooLongError extends EmailError {
  constructor() {
    super("Email exceeds maximum length of 254 characters");
  }
}
